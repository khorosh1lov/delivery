const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();

// Endpoint for all Dishes in restaurant
router.get('/:restaurantId', async (req, res) => {
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
});

// Endpoint to get a specific Dish from a restaurant
router.get('/:restaurantId/:dishId', async (req, res) => {
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
});

module.exports = router;