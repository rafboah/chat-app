if(process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authenticateToken');    

// const test = require('./server.js')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true}).then(
    () => console.log('MongoDB connected')
).catch(
    err => console.error('MongoDB connection error: ', err)
)

// socket authentication
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) 
            return next(new Error('Authentication error'));

        socket.userId = decoded.userId;

        next();
    });
});

// socket connection
io.on('connection', (socket) =>{
    userSockets[socket.userId] = socket.id;
    console.log(`Authenticated User connected: ${socket.userId}`);

    socket.on('disconnect', () => {
        delete userSockets[socket.userId];
        console.log(`Autheticated User disconnected: ${socket.userId}`);
    });

    socket.on('send_message', data => {
        const {receipientId, message} = data;
        const receipientSocketId = userSockets[receipientId];
        if(receipientSocketId)
            socket.to(receipientSocketId).emit('new_message', {message, senderId: socket.userId});
    });
});
let userSockets = {};

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = test;