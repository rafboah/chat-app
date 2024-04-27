const express = require('express');
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload');

const router = express.Router();

// Send Message endpoint protected with authenticateToken middleware
router.post('/sendMessage/:userId', authenticateToken, upload.single('file'), messageController.sendMessage);

// Fetch Messages endpoint protected with authenticateToken middleware
router.get('/fetchMessages/:userId', authenticateToken, messageController.fetchMessages);

module.exports = router;