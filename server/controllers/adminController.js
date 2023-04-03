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

// POST: new Image
exports.addImage = (req, res) => {
	if (req.file) {
		res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
	} else {
		res.status(400).json({ message: 'Error uploading image' });
	}
};
