const Restaurant = require('../models/resto');
const Dish = require('../models/dish');

// GET: All Restaurants for root path '/'
exports.getAllRestaurants = async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		res.status(200).json(restaurants);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with restaurants list receiving' });
	}
};

// POST: New Restaurant
exports.addRestaurant = async (req, res) => {
	const restaurantData = req.body;
	const restaurant = new Restaurant(restaurantData);
	await restaurant.save();
	res.status(201).json({ message: 'Restaurant added', restaurant });
};

// PUT: update Restaurant by ID
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

// POST: New Dish for Restaurant
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

// GET: Total count of Restaurants
exports.countRestaurants = async (req, res) => {
	try {
		const count = await Restaurant.countDocuments();
		res.status(200).json(count);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with restaurants count receiving' });
	}
};
