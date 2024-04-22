require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const test = require('./server.js')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;
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
        if(err) return next(new Error('Authentication error'));
        socket.userId = decoded.userId;

        next();
    });
});

// socket connection
io.on('connection', (socket) =>{
    console.log(`Authenticated User connected: ${socket.userId}`);

    socket.on('disconnection', () => {
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

// User signup endpoint
app.post('/signup', async (req, res) => {
    try {
        const newUser = User({
            email: req.body.email,
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
            gender: req.body.gender
        });
        await newUser.save();
        res.status(201).send('New User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login endpoint
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user || !await bcrypt.compare(req.body.password))
            return res.status(401).send('Authentication failed');

        const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: '50h'});
        res.json({token});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Token authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null)
        return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;

        next();
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = test;