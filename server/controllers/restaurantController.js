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

// DELETE: Restaurant by ID
exports.deleteRestaurant = async (req, res) => {
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
						$lte: today,
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
				$sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
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
			{
				$group: {
					_id: '$date',
					total: { $last: '$total' },
				},
			},
			{
				$project: {
					_id: 0,
					date: '$_id',
					total: { $sum: ['$total'] },
				},
			},
			{
				$sort: { date: 1 },
			},
			{
				$limit: 10,
			},
		]);

		const filledData = [];

		for (let i = 0; i < 10; i++) {
			const currentDate = new Date(tenDaysAgo);
			currentDate.setDate(currentDate.getDate() + i);
			const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
			const found = dailyData.find((item) => item.date === dateStr);

			if (found) {
				filledData.push(found);
			} else {
				filledData.push({ date: dateStr, total: 0 });
			}
		}

		res.status(200).json(filledData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching daily restaurant data' });
	}
};
