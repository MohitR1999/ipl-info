const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MSG_TYPES } = require('../utils/messageTypes');

const MATCH_SCHEDULE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js`
const LIVE_SCORES_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/1825-Innings1.js`;
const POINTS_TABLE_URL = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/203-groupstandings.js`;

let matchSchedule = {};
let pointsTable = {};
let liveScores = {};

router.get('/', (req, res) => {
    res.status(200).json({
        message: "API route working"
    });
});

function MatchSchedule(data) {
    matchSchedule = data;
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
router.get('/match', async (req, res) => {
    try {
        const response = await axios.get(`${LIVE_SCORES_URL}`);
        eval(response.data);
        res.status(200).json({
            data : liveScores
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