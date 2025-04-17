const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MSG_TYPES } = require('../utils/messageTypes');

const MATCH_SCHEDULE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js`
const LIVE_SCORES_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds`;
const POINTS_TABLE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/203-groupstandings.js`;

let matchSchedule = null;
let pointsTable = {};
let liveScores = {};
let currentLiveMatchId = "";

// Middleware to validate and refresh currentLiveMatchId
async function validateLiveMatchId(req, res, next) {
    try {
        if (!currentLiveMatchId || !isMatchStillLive(currentLiveMatchId)) {
            const response = await axios.get(`${MATCH_SCHEDULE_URL}`);
            eval(response.data);
            const liveMatch = matchSchedule.find(m => m['MatchStatus'] === 'Live');
            currentLiveMatchId = liveMatch ? liveMatch['MatchID'] : null;
        }
        next();
    } catch (error) {
        console.error("Error refreshing live match ID:", error);
        res.status(500).json({ error: "Failed to refresh live match ID" });
    }
}

// Helper function to check if the current match is still live
function isMatchStillLive(matchId) {
    const liveMatch = matchSchedule.find(m => m['MatchID'] === matchId && m['MatchStatus'] === 'Live');
    return !!liveMatch;
}

// Function to refresh currentLiveMatchId periodically
async function refreshLiveMatchId() {
    try {
        const response = await axios.get(`${MATCH_SCHEDULE_URL}`);
        eval(response.data);
        const liveMatch = matchSchedule.find(m => m['MatchStatus'] === 'Live');
        currentLiveMatchId = liveMatch ? liveMatch['MatchID'] : null;
        console.log("Updated currentLiveMatchId:", currentLiveMatchId);
    } catch (error) {
        console.error("Error refreshing live match ID:", error);
    }
}

// Start periodic refresh every 1 minute (60000 ms)
setInterval(refreshLiveMatchId, 60000);

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
    liveScores = data;
}

// Route for live match.
// If there is a match ongoing, return commentary info
// If there is no live match, return upcoming match info
router.get('/match', validateLiveMatchId, async (req, res) => {
    try {
        if (!currentLiveMatchId) {
            // No live match found, return the upcoming match info
            const upcomingMatch = matchSchedule.find(m => m['MatchStatus'] === 'UpComing');
            if (upcomingMatch) {
                return res.status(200).json({
                    message: "No live match found. Pls check the upcoming match details",
                    data: upcomingMatch
                });
            } else {
                return res.status(404).json({ error: "No live or upcoming match found" });
            }
        }
        const liveMatchResponse = await axios.get(`${LIVE_SCORES_URL}/${currentLiveMatchId}-Innings1.js`);
        eval(liveMatchResponse.data);
        res.status(200).json({
            data: liveScores
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error!"
        });
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


module.exports = router;