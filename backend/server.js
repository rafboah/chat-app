if(process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const messageRoute = require('./routes/messageRoute');
const uploadRoute = require('./routes/uploadRoute');
// const authenticateToken = require('./middleware/authenticateToken');    

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
        userSockets[socket.userId] = socket.id;

        next();
    });
});

// socket connection
io.on('connection', (socket) =>{
    console.log(`Authenticated User connected: ${socket.userId}`);

    socket.on('send_message', data => {
        const {recipientId, message} = data;
        const recipientSocketId = userSockets[recipientId];
        if(recipientSocketId)
            io.to(recipientSocketId).emit('new_message', {message, senderId: socket.userId});
        else
            console.log(`Recipient ${recipientId} is not connected.`);
    });

    socket.on('disconnect', () => {
        delete userSockets[socket.userId];
        console.log(`Autheticated User disconnected: ${socket.userId}`);
    });
});
let userSockets = {};

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);
app.use('/api/upload', uploadRoute);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = test;