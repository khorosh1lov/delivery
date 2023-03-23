const mongoose = require('mongoose');
const Restaurant = require('../models/resto');
const Dish = require('../models/dish');

mongoose.connect('mongodb://localhost:27017/delivery', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function createRestaurant() {
	try {
		const dishes = [
			new Dish({
				name: 'Burger',
				description: 'Juicy beef burger with fresh lettuce, tomato, and onion',
				category: 'Main Course',
				price: 10.99,
				specialOffer: 'none',
				ingredients: ['beef', 'lettuce', 'tomato', 'onion', 'bun'],
				allergens: ['wheat', 'gluten'],
			}),
			new Dish({
				name: 'Caesar Salad',
				description: 'Classic Caesar salad with fresh romaine lettuce, Parmesan cheese, and croutons',
				category: 'Salad',
				price: 7.99,
				specialOffer: 'none',
				ingredients: ['romaine lettuce', 'Parmesan cheese', 'croutons', 'Caesar dressing'],
				allergens: ['dairy', 'wheat', 'gluten'],
			}),
		];

		const newRestaurant = new Restaurant({
			name: 'Tommy Food',
			address: {
				street: '11111 120th Ln East',
				city: 'Seattle',
				state: 'WA',
				zip: '98001',
			},
			contactInfo: {
				phone: '+1 422-555-5555',
				email: 'tommy-food@mail.com',
			},
			cuisine: 'American',
			rating: 4,
			dishes: dishes,
			slug: 'tommy-food',
		});

		const savedRestaurant = await newRestaurant.save();
		console.log('Restaurant created:', savedRestaurant);
	} catch (error) {
		console.error('Error creating Restaurant:', error);
	} finally {
		mongoose.connection.close();
	}
}

createRestaurant();
