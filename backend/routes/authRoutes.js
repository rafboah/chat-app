const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User signup endpoint
router.post('/signup', authController.signup);

// User login endpoint
router.post('/login', authController.login);

module.exports = router;    