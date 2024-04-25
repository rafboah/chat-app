const express = require('express');
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Messages endpoint protected with authenticateToken middleware
router.get('/messages/:userId', authenticateToken, messageController);