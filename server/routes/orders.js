const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
//const ensureAuth = require('../middleware/auth');
//const checkUserAccess = require('../middleware/checkAccess');
const { NotFoundError, ForbiddenError } = require('../errors');
const { setUser } = require('../middleware/user'); // Import the setUser middleware
const router = express.Router();

// Endpoint to get all orders for a user by their ID
router.get('/:userId', setUser, async (req, res, next) => {
	try {
		const userId = req.params.userId;

		const user = await User.findById(userId);

		if (user == null) {
			throw new NotFoundError('User not found');
		}

		if (req.user._id.toString() !== userId) {
			throw new ForbiddenError('Access denied');
		}

		const orders = await Order.find({ user: userId });

		res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
