const Restaurant = require('../models/resto');

// GET: All Dishes from Restaurant
exports.getAllDishes = async (req, res) => {
	const restaurantId = req.params.restaurantId;
	console.log(restaurantId); // Resto ID in console
	try {
		const restaurant = await Restaurant.findById(restaurantId.toString());
		if (restaurant) {
			res.status(200).json(restaurant.dishes);
		} else {
			res.status(404).json({ message: 'Restaurant not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with dish receiving' });
	}
};

// GET: one Dish from Restaurant
exports.getDish = async (req, res) => {
	const restaurantId = req.params.restaurantId;
	const dishId = req.params.dishId;

	try {
		const restaurant = await Restaurant.findById(restaurantId.toString());
		if (restaurant) {
			const dish = restaurant.dishes.id(dishId);
			if (dish) {
				res.status(200).json(dish);
			} else {
				res.status(404).json({ message: 'Dish not found' });
			}
		} else {
			res.status(404).json({ message: 'Restaurant not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with dish receiving' });
	}
};