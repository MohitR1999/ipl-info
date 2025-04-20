const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MSG_TYPES } = require('../utils/messageTypes');
const { Server } = require('socket.io');

const MATCH_SCHEDULE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js`
const LIVE_SCORES_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds`;
const POINTS_TABLE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/203-groupstandings.js`;
const MATCH_SUMMARY_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds`

let matchSchedule = null;
let pointsTable = {};
let liveScores = [];
let matchSummary = {};
let currentLiveMatches = [];

const REFRESH_INTERVAL_SECONDS = 10;
const MILLISECONDS = 1000;

// Helper function to fetch and update match schedule
async function fetchMatchSchedule() {
    try {
        const response = await axios.get(`${MATCH_SCHEDULE_URL}`);
        eval(response.data);
    } catch (error) {
        console.error("Error fetching match schedule:", error);
    }
}

// Helper function to fetch live scores
async function fetchLiveScores(matchId, innings) {
    try {
        if (matchId) {
            const response = await axios.get(`${LIVE_SCORES_URL}/${matchId}-Innings${innings}.js`);
            eval(response.data);
        }
    } catch (error) {
        console.error("Error fetching live scores:", error);
        throw error;
    }
}


// Function to refresh currentLiveMatchId
async function refreshLiveMatches() {
    try {
        await fetchMatchSchedule();
        const liveMatches = matchSchedule.filter(m => m['MatchStatus'] === 'Live');
        currentLiveMatches = liveMatches.length > 0 ? liveMatches : [];
        console.log("Current live matches: ", currentLiveMatches.map(m => m['MatchID']));
    } catch (error) {
        console.error("Error refreshing live match ID:", error);
    }
}

async function fetchMatchSummary(matchId) {
    try {
        if (matchId) {
            const response = await axios.get(`${MATCH_SUMMARY_URL}/${matchId}-matchsummary.js`);
            eval(response.data);
        }
    } catch (error) {
        console.error("Error fetching live scores:", error);
        throw error;
    }
}

// Start periodic refresh every 1 minute (60000 ms)
setInterval(refreshLiveMatches, REFRESH_INTERVAL_SECONDS * MILLISECONDS);

// Initial refresh on server start
refreshLiveMatches();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "API route working"
    });
});

function MatchSchedule(data) {
    matchSchedule = data['Matchsummary'].reduce((accumulator, current) => {
        if ((current['MatchStatus'] == 'Live' || current['MatchStatus'] == 'UpComing') 
            && (current['HomeTeamName'] != 'TBD' && current['AwayTeamName'] != 'TBD')) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);
}

function ongroupstandings(data) {
    pointsTable = data;
    pointsTable['points'].forEach(element => {
        element['Performance'] = element['Performance'].split("").reverse().join("");
    });
}

function onScoring(data) {
    if (data['Innings1']) {
        liveScores = data['Innings1']['OverHistory'].filter(e => e['BallID'] != '0');
    } else if (data['Innings2']) {
        liveScores = data['Innings2']['OverHistory'].filter(e => e['BallID'] != '0');
    } else {
        liveScores = [];
    }
}

function onScoringMatchsummary(data) {
    matchSummary = data['MatchSummary'][0];
}

router.get('/live-matches', async (req, res) => {
    try {
        await refreshLiveMatches();
        let status = 404;
        if (currentLiveMatches.length > 0) {
            status = 200;
        } 
        return res.status(status).json(currentLiveMatches);
    } catch (error) {
        console.error("Error fetching live match details:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
});

// HTTP Endpoint: Get live match details
router.get('/live', async (req, res) => {
    try {
        const matchId = req.query.matchId;
        const innings = req.query.innings;
        if (!matchId && !innings) {
            return res.status(404).json([]);
        }
        await fetchLiveScores(matchId, innings);
        res.status(200).json(liveScores);
    } catch (error) {
        console.error("Error fetching live match details:", error);
        if (error.status == 404) 
            return res.status(404).json([]);
        else 
            return res.status(500).json({ error: "Internal server error!" });
    }
});

// HTTP Endpoint: Get upcoming match details
router.get('/upcoming', async (req, res) => {
    try {
        if (!matchSchedule) {
            await fetchMatchSchedule();
        }
        const upcomingMatch = matchSchedule.find(m => m['MatchStatus'] === 'UpComing');
        if (upcomingMatch) {
            res.status(200).json({
                message: "Upcoming match details",
                data: upcomingMatch
            });
        } else {
            res.status(404).json({ error: "No upcoming match found" });
        }
    } catch (error) {
        console.error("Error fetching upcoming match:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
});


// Route for match schedule.
// Return the list of all matches, including the current ongoing match
router.get('/schedule', async (req, res) => {
    try {
        const response = await axios.get(`${MATCH_SCHEDULE_URL}`);
        eval(response.data);
        res.status(200).json({
            data : matchSchedule
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
});

// Route for points table
// Return the points table info
router.get('/points', async (req, res) => {
    try {
        const response = await axios.get(`${POINTS_TABLE_URL}`);
        eval(response.data);
        res.status(200).json({
            data : pointsTable
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
});

// Route for points table
// Return the points table info
router.get('/summary', async (req, res) => {
    try {
        const matchId = req.query.matchId;
        if (matchId) {
            await fetchMatchSummary(matchId);
            res.status(200).json(matchSummary);
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
});

// WebSocket Route: Push live match events
function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log("Client connected via WebSocket");
        socket.on('get-score', async (msg) => {
            console.log('Received msg: ', msg);
            await fetchMatchSummary(msg.match);
            socket.emit('live-score', matchSummary);
        })

        socket.on('get-commentary', async (msg) => {
            await fetchMatchSummary(msg.match);
            const cursor = msg.cursor;
            const innings = matchSummary['CurrentInnings'];
            if (innings) {
                await fetchLiveScores(msg.match, innings);
                const scoresToSend = liveScores.filter(score => parseInt(score.BallUniqueID) > parseInt(cursor));
                socket.emit('live-commentary', scoresToSend && scoresToSend.length > 0 ? scoresToSend : []);
            }
        })

        // Handle client disconnect
        socket.on('disconnect', () => {
            console.log("Client disconnected");
        });
    });

    console.log("WebSocket server setup complete");
}


module.exports = {router, setupWebSocket};