const Restaurant = require('../models/resto');
const Dish = require('../models/dish');

exports.addRestaurant = async (req, res) => {
	const restaurantData = req.body;
	const restaurant = new Restaurant(restaurantData);
	await restaurant.save();
	res.status(201).json({ message: 'Restaurant added', restaurant });
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
