const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const ensureAdmin = require('../middlewares/ensureAdmin');
const { addRestaurant, addDish } = require('../controllers/restaurants');

// Endpoint for all restaurants
router.get('/', async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		res.status(200).json(restaurants);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with restaurants list receiving' });
	}
});

// Endpoint for one restaurant by ID
router.get('/:restaurantId', async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		console.log(restaurantId); // Resto ID in console

		const restaurant = await Restaurant.findById(restaurantId);
		if (restaurant == null) {
			return res.redirect('/');
		}

		res.status(200).json(restaurant);
	} catch (error) {
		console.error(error);
		
		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

// Endpoint for all Dishes in restaurant
router.get('/:restaurantId/dishes', async (req, res) => {
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
router.get('/:restaurantId/dishes/:dishId', async (req, res) => {
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

// Endpoint for one restaurant by Slug
router.get('/restaurant/:slug', async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne({ slug: req.params.slug });
		if (restaurant == null) {
			return res.redirect('/');
		}

		res.status(200).json(restaurant);
	} catch (error) {
		console.error(error);

		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

// Admin

// Add a new restaurant
router.post('/', ensureAdmin, addRestaurant);

// Add a new dish to a restaurant
router.post('/:restaurantId/dishes', ensureAdmin, addDish);

module.exports = router;
