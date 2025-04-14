let io;
const { Server } = require('socket.io');
const { MSG_TYPES } = require('../utils/messageTypes');

let fixturesData = {};
let standingsData = {};
let scoresData = {};

function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost'
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connection established');

        // Listen for data from the client
        socket.on(MSG_TYPES.GET_FIXTURES, (data) => {
            console.log('Received fixtures data:', data);
            fixturesData = data;
        });

        socket.on(MSG_TYPES.GET_STANDINGS, (data) => {
            console.log('Received standings data:', data);
            standingsData = data;
        });

        socket.on(MSG_TYPES.GET_SCORES, (data) => {
            console.log('Received scores data:', data);
            scoresData = data;
        });
    });
}

function emit(msgType, data) {
    io.emit(msgType, data);
}

function getData(type) {
    if (type === MSG_TYPES.GET_FIXTURES) return fixturesData;
    if (type === MSG_TYPES.GET_STANDINGS) return standingsData;
    if (type === MSG_TYPES.GET_SCORES) return scoresData;
    return {};
}

exports.initialize = initialize;
exports.emit = emit;
exports.getData = getData;