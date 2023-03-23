const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Endpoint for one restaurant by ID
router.get('/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		console.log(userId); // User ID in console

		const orders = await Order.findById(userId);
		if (orders == null) res.redirect('/');

		res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		
		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});
