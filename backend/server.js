require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// const test = require('./server.js')
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) =>{
    console.log('Client connected');

    socket.on('disconnection', () => {
        console.log('Client disconnected');
    });

    socket.on('message', (message) => {
        console.log('Message received: ', message);
        io.emit('message', message);
    });
});

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = test;