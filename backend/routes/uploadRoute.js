const express = require('express');
const uploadController = require('../controllers/uploadController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload');

const router = express.Router();

// File upload endpoint
router.post('/upload', authenticateToken, upload.single('file'), uploadController.upload);

module.exports = router;