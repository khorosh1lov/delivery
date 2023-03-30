const mongoose = require('mongoose');
const faker = require('faker');
const Restaurant = require('../models/resto');
const Dish = require('../models/dish');

const remoteUrl = 'mongodb+srv://delivery-app-user:FwDTveu4Z6fxbMUY@delivery-app-db.kimyhfv.mongodb.net/?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
//const localUrl = 'mongodb://localhost:27017/delivery';

mongoose
	.connect(remoteUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected correctly to DB server');
	})
	.catch((err) => {
		console.log(err.stack);
	});

function generateDishes() {
	const dishes = [];
	const dishCount = faker.datatype.number({ min: 8, max: 15 });

	for (let i = 0; i < dishCount; i++) {
		dishes.push(
			new Dish({
				name: faker.random.words(2),
				description: faker.lorem.sentence(),
				category: faker.random.arrayElement(['Main Course', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Drink']),
				price: faker.commerce.price(5, 25),
				specialOffer: 'none',
				ingredients: Array.from({ length: faker.datatype.number({ min: 2, max: 8 }) }, () => faker.random.word()),
				allergens: Array.from({ length: faker.datatype.number({ min: 0, max: 3 }) }, () => faker.random.word()),
			}),
		);
	}

	return dishes;
}

async function createRestaurants() {
	try {
		for (let i = 0; i < 20; i++) {
			const dishes = generateDishes();

			const newRestaurant = new Restaurant({
				name: faker.company.companyName(),
				address: {
					street: faker.address.streetAddress(),
					city: faker.address.city(),
					state: faker.address.stateAbbr(),
					zip: faker.address.zipCode(),
				},
				contactInfo: {
					phone: faker.phone.phoneNumber(),
					email: faker.internet.email(),
				},
				cuisine: faker.random.arrayElement(['American', 'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian']),
				rating: faker.datatype.number({ min: 1, max: 5 }),
				dishes: dishes,
				slug: faker.helpers.slugify(faker.company.companyName()),
			});

			const savedRestaurant = await newRestaurant.save();
			console.log(`Restaurant ${i + 1} created:`, savedRestaurant);
		}
	} catch (error) {
		console.error('Error creating Restaurants:', error);
	} finally {
		mongoose.connection.close();
	}
}

createRestaurants();
