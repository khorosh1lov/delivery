const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
//const ensureAuth = require('../middlewares/auth');
//const checkUserAccess = require('../middlewares/checkAccess');
//const { setUser } = require('../middlewares/user');
const { NotFoundError, ForbiddenError } = require('../errors');
const dummyAuth = require('../middlewares/dummyAuth'); // Import dummyAuth
const router = express.Router();

// Endpoint to get all orders for a user by their ID
router.get('/:userId', dummyAuth, async (req, res, next) => {
	try {
		const userId = req.params.userId;

		const user = await User.findById(userId);

		if (user == null) {
			throw new NotFoundError('User not found');
		}

		if (req.user._id.toString() !== userId) {
			throw new ForbiddenError('Access denied');
		}

		const orders = await Order.find({ user: userId }).populate('user').populate('items.dish').populate('items.restaurant');

		res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
});



module.exports = router;
