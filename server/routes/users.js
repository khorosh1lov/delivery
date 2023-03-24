const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const router = express.Router();

// Endpoint for all orders for only one User by User ID
router.get('/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		console.log(userId); // User ID in console

		const user = await User.findById(userId);
		
		if (user == null) {
			return res.redirect('/');
		}

		res.status(200).json(user);
	} catch (error) {
		console.error(error);

		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

module.exports = router;