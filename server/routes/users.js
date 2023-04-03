const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const ensureAuth = require('../middlewares/auth');
const dummyAuth = require('../middlewares/dummyAuth'); // I
const checkUserAccess = require('../middlewares/checkAccess');
const { NotFoundError, ForbiddenError } = require('../errors');
const { submitRating } = require('../controllers/restaurants');
const router = express.Router();

// Endpoint for only one User by User ID
router.get('/:userId', ensureAuth, checkUserAccess, async (req, res, next) => {
	try {
		const userId = req.params.userId;
		console.log(userId); // User ID in console

		const user = await User.findById(userId);

		if (user == null) {
			throw new NotFoundError('User not found');
		}

		if (req.user._id.toString() !== userId) {
			throw new ForbiddenError('Access denied');
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

// Endpoint for all orders for only one User by User ID
router.get('/:userId/orders', ensureAuth, checkUserAccess, async (req, res, next) => {
	try {
		const userId = req.params.userId;
		console.log(userId); // User ID in console

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

// Endpoint for a specific order for a user by User ID and Order ID
router.get('/:userId/orders/:orderId', dummyAuth, checkUserAccess, async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const orderId = req.params.orderId;

		const user = await User.findById(userId);

		if (user == null) {
			throw new NotFoundError('User not found');
		}

		if (req.user._id.toString() !== userId) {
			throw new ForbiddenError('Access denied');
		}

		const order = await Order.findOne({ _id: orderId, user: userId }).populate('user').populate('items.dish').populate('items.restaurant');

		if (order == null) {
			throw new NotFoundError('Order not found');
		}

		res.status(200).json(order);
	} catch (error) {
		next(error);
	}
});

// Endpoint for new restaurant rating by ID
router.post('/:restaurantId/rating/submit', ensureAuth, submitRating);

// Endpoint to create a new order for a user
router.post('/:userId/orders', ensureAuth, checkUserAccess, async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (req.user._id.toString() !== userId) {
            throw new ForbiddenError('Access denied');
        }

        const newOrder = new Order({ ...req.body, user: userId });
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
});

// Endpoint to update an order for a user
router.put('/:userId/orders/:orderId', ensureAuth, checkUserAccess, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const orderId = req.params.orderId;

        if (req.user._id.toString() !== userId) {
            throw new ForbiddenError('Access denied');
        }

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (order == null) {
            throw new NotFoundError('Order not found');
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true });

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
