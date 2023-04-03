const Restaurant = require('../models/resto');
const Dish = require('../models/dish');
const User = require('../models/user');

exports.addRestaurant = async (req, res) => {
	const restaurantData = req.body;
	const restaurant = new Restaurant(restaurantData);
	await restaurant.save();
	res.status(201).json({ message: 'Restaurant added', restaurant });
};

exports.updateRestaurant = async (req, res) => {
	const { restaurantId } = req.params;
	const updatedData = req.body;

	try {
		const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updatedData, { new: true });

		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}

		res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error updating restaurant' });
	}
};

exports.submitRating = async (req, res) => {
	const { restaurantId, userId, rating } = req.body;

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

exports.addDish = async (req, res) => {
	const { restaurantId } = req.params;
	const dishData = req.body;
	const restaurant = await Restaurant.findById(restaurantId);

	if (!restaurant) {
		return res.status(404).json({ message: 'Restaurant not found' });
	}

	const dish = new Dish(dishData);
	restaurant.dishes.push(dish);
	await dish.save();
	await restaurant.save();

	res.status(201).json({ message: 'Dish added', dish });
};
