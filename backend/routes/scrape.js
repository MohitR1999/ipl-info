const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MSG_TYPES } = require('../utils/messageTypes');
const { Server } = require('socket.io');

const MATCH_SCHEDULE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js`
const LIVE_SCORES_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds`;
const POINTS_TABLE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/203-groupstandings.js`;

let matchSchedule = null;
let pointsTable = {};
let liveScores = {};
let currentLiveMatchId = "";

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
async function fetchLiveScores() {
    try {
        if (currentLiveMatchId) {
            const response = await axios.get(`${LIVE_SCORES_URL}/${currentLiveMatchId}-Innings1.js`);
            eval(response.data);
        }
    } catch (error) {
        console.error("Error fetching live scores:", error);
    }
}


// Function to refresh currentLiveMatchId
async function refreshLiveMatchId() {
    try {
        await fetchMatchSchedule();
        const liveMatch = matchSchedule.find(m => m['MatchStatus'] === 'Live');
        currentLiveMatchId = liveMatch ? liveMatch['MatchID'] : null;
        console.log("Updated currentLiveMatchId:", currentLiveMatchId);
    } catch (error) {
        console.error("Error refreshing live match ID:", error);
    }
}

// Start periodic refresh every 1 minute (60000 ms)
setInterval(refreshLiveMatchId, REFRESH_INTERVAL_SECONDS * MILLISECONDS);

// Initial refresh on server start
refreshLiveMatchId();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "API route working"
    });
});

function MatchSchedule(data) {
    matchSchedule = data['Matchsummary'].reduce((accumulator, current) => {
        if (current['MatchStatus'] == 'Live' || current['MatchStatus'] == 'UpComing') {
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
    liveScores = data['Innings1']['OverHistory'];
}

// HTTP Endpoint: Get live match details
router.get('/live', async (req, res) => {
    try {
        if (!currentLiveMatchId) {
            return res.status(404).json({ error: "No live match currently" });
        }
        await fetchLiveScores();
        res.status(200).json({
            message: "Live match details",
            data: liveScores
        });
    } catch (error) {
        console.error("Error fetching live match details:", error);
        res.status(500).json({ error: "Internal server error!" });
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

        // Periodically send live match updates
        const intervalId = setInterval(async () => {
            try {
                if (!currentLiveMatchId) {
                    socket.emit('no-live-match', { message: "No live match currently" });
                } else {
                    await fetchLiveScores();
                    socket.emit('live-match-update', { data: liveScores });
                }
            } catch (error) {
                console.error("Error sending live match updates:", error);
                socket.emit('error', { error: "Failed to fetch live match updates" });
            }
        }, 10000); // Send updates every 10 seconds

        // Handle client disconnect
        socket.on('disconnect', () => {
            console.log("Client disconnected");
            clearInterval(intervalId);
        });
    });

    console.log("WebSocket server setup complete");
}


module.exports = {router, setupWebSocket};