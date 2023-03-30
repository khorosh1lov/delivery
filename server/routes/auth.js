const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Sign up route (API endpoint)
router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: 'Email already taken' });
		}

		console.log('Creating new user');
		// Create a new user with the plain password
		const newUser = new User({ name, email, password });
		await newUser.save();

		console.log('Logging in new user');
		// Log the user in
		req.login(newUser, (err) => {
			if (err) {
				console.error('Error logging in after signup:', err);
				return res.status(500).json({ message: 'Error logging in after signup' });
			}
			return res.status(201).json({ message: 'Signup successful', user: newUser });
		});
	} catch (error) {
		console.error('Error during signup:', error);
		res.status(500).json({ message: 'Error during signup' });
	}
});


// Login route (API endpoint)
router.post('/login', (req, res, next) => {
    console.log('Authenticate existing user');
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('Authenticate user error:', err);
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('Login user error:', err);
                return next(err);
            }
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Logout route (API endpoint)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
    res.redirect('/');
});

module.exports = router;