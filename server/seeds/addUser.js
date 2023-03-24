const mongoose = require('mongoose');
const User = require('../models/user');
const Restaurant = require('../models/resto');
const Order = require('../models/order');

mongoose.connect('mongodb://localhost:27017/delivery', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function createUserWithOrders() {
	try {
		const newUser = new User({
			name: 'John Doe',
			email: 'john.doe@mail.com',
			password: 'password123',
			address: {
				street: '12345 Elm St',
				city: 'Seattle',
				state: 'WA',
				zip: '98101',
			},
			phone: '+1 206-555-1234',
		});

		const savedUser = await newUser.save();
		console.log('User created:', savedUser);

		const restaurant = await Restaurant.findOne({ slug: 'tommy-food' });

		if (!restaurant) {
			console.error('Error: Restaurant not found');
			return;
		}

		const orders = [
			{
				user: savedUser._id,
				items: [
					{
						dish: restaurant.dishes[0]._id,
						quantity: 2,
						restaurant: restaurant._id,
					},
					{
						dish: restaurant.dishes[1]._id,
						quantity: 1,
						restaurant: restaurant._id,
					},
				],
				totalPrice: restaurant.dishes[0].price * 2 + restaurant.dishes[1].price,
				deliveryAddress: savedUser.address,
			},
			{
				user: savedUser._id,
				items: [
					{
						dish: restaurant.dishes[0]._id,
						quantity: 1,
						restaurant: restaurant._id,
					},
				],
				totalPrice: restaurant.dishes[0].price,
				deliveryAddress: savedUser.address,
			},
		];

		const savedOrders = await Order.insertMany(orders);
		console.log('Orders created:', savedOrders);
	} catch (error) {
		console.error('Error creating user and orders:', error);
	} finally {
		mongoose.connection.close();
	}
}

createUserWithOrders();
