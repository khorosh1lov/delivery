const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signup, login, logout } = require('../controllers/authController');

// Sign up route (API endpoint)
router.post('/signup', signup);

// Login route (API endpoint)
router.post('/login', login);

// Logout route (API endpoint)
router.post('/logout', logout);

module.exports = router;