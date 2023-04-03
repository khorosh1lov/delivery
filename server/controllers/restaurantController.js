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

// GET: One Restaurant by ID
exports.getRestaurant = async (req, res) => {
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
}; 

// GET: One Restaurant by Slug
exports.getRestaurantByName = async (req, res) => {
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

// GET: Total count of Restaurants for one Day
exports.getDailyData = async (req, res) => {
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
};
