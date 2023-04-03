const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const { getAllRestaurants, countRestaurants } = require('../controllers/restaurantController');

// Endpoint for all restaurants
router.get('/', getAllRestaurants);

// Endpoint for total Restaurants count
router.get('/count', countRestaurants);

// Endpoint for daily restaurant data
router.get('/dailyData', async (req, res) => {
	try {
		const today = new Date();
		const tenDaysAgo = new Date(today);
		tenDaysAgo.setDate(today.getDate() - 10);

		const dailyData = await Restaurant.aggregate([
			{
				$match: {
					createdAt: {
						$gte: tenDaysAgo,
						$lte: today, // Change $lt to $lte to include the current date
					},
				},
			},
			{
				$group: {
					_id: {
						day: { $dayOfMonth: '$createdAt' },
						month: { $month: '$createdAt' },
						year: { $year: '$createdAt' },
					},
					total: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					date: {
						$concat: [{ $toString: '$_id.month' }, '/', { $toString: '$_id.day' }, '/', { $toString: '$_id.year' }],
					},
					total: 1,
				},
			},
			{ $sort: { date: 1 } },
		]);

		res.status(200).json(dailyData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching daily restaurant data' });
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

// Endpoint to delete a restaurant by ID
router.delete('/:restaurantId', async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		console.log('Deleting restaurant with ID:', restaurantId);

		const restaurant = await Restaurant.findById(restaurantId);
		if (restaurant == null) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}

		await Restaurant.deleteOne({ _id: restaurantId });
		res.status(200).json({ message: 'Restaurant deleted successfully' });
	} catch (error) {
		console.error('Error deleting restaurant:', error);
		res.status(500).json({ message: 'Error deleting restaurant' });
	}
});

module.exports = router;
