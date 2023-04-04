const Restaurant = require('../models/resto');
const User = require('../models/user');
const Order = require('../models/order');

// GET: User by ID
exports.getUser = async (req, res, next) => {
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
};

// GET: Orders by User ID
exports.getOrders = async (req, res, next) => {
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
};

// GET: Order by User ID and Order ID
exports.getOrder = async (req, res, next) => {
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
};

// POST: new Order for User
exports.addOrder = async (req, res, next) => {
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
};

// PUT: existing Order for User
exports.updateOrder = async (req, res, next) => {
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
}; 

// POST: new Rating by User for Restaurant
exports.submitRating = async (req, res) => {
	const userId = req.params.userId;
	const restaurantId = req.params.restaurantId;
	const { rating } = req.body;

	try {
		const restaurant = await Restaurant.findById(restaurantId);
		const user = await User.findById(userId);

		if (!restaurant || !user) {
			return res.status(404).json({ message: 'Restaurant or user not found' });
		}

		// Check if the user has already rated this restaurant
		const existingRating = restaurant.ratings.find((r) => r.user.toString() === userId);

		if (existingRating) {
			existingRating.rating = rating;
		} else {
			restaurant.ratings.push({ user: userId, rating });
			user.ratedRestaurants.push(restaurantId);
			await user.save();
		}

		await restaurant.save();

		// Calculate the new median rating
		const sortedRatings = restaurant.ratings.map((r) => r.rating).sort((a, b) => a - b);
		const middleIndex = Math.floor(sortedRatings.length / 2);
		const medianRating = sortedRatings.length % 2 === 0 ? (sortedRatings[middleIndex - 1] + sortedRatings[middleIndex]) / 2 : sortedRatings[middleIndex];

		res.status(200).json({ message: 'Rating submitted successfully', medianRating });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error submitting rating' });
	}
};

