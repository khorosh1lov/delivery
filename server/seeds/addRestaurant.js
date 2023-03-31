require('dotenv').config({ path: '../../.env' });

const faker = require('faker');
const Restaurant = require('../models/resto');
const Dish = require('../models/dish');
const { connectDB, mongoose } = require('../config/database');
const axios = require('axios');

(async () => {
	try {
		await connectDB(); // Connect to the database using the imported function

		function generateDishes() {
			const dishes = [];
			const dishCount = faker.datatype.number({ min: 5, max: 20 });

			for (let i = 0; i < dishCount; i++) {
				dishes.push(
					new Dish({
						name: faker.random.words(2),
						description: faker.lorem.sentence(),
						category: faker.random.arrayElement(['Main Course', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Drink', 'Snack', 'BBQ', 'Grill']),
						price: faker.commerce.price(5, 25),
						specialOffer: 'none',
						ingredients: Array.from({ length: faker.datatype.number({ min: 2, max: 8 }) }, () => faker.random.word()),
						allergens: Array.from({ length: faker.datatype.number({ min: 0, max: 3 }) }, () => faker.random.word()),
					}),
				);
			}

			return dishes;
		}

		function randomWorkingDays() {
			const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
			return faker.random.arrayElements(days, faker.datatype.number({ min: 5, max: 7 }));
		}

		function randomWorkingHours() {
			return {
				from: faker.random.arrayElement(['06:00', '07:00', '08:00', '09:00', '10:00']),
				to: faker.random.arrayElement(['17:00', '18:00', '19:00', '20:00', '21:00', '22:00']),
			};
		}

		async function createRestaurants() {
			try {
				for (let i = 0; i < 30; i++) {
					const dishes = generateDishes();

					const logoResponse = await axios.get('https://loremflickr.com/200/200/logo');
					const headerImageResponse = await axios.get('https://loremflickr.com/640/360/cafe');

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
						cuisine: faker.random.arrayElement(['American', 'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'French', 'High Kitchen']),
						rating: faker.datatype.number({ min: 1, max: 5 }),
						dishes: dishes,
						slug: faker.helpers.slugify(faker.company.companyName()),
						workingDays: randomWorkingDays(),
						workingHours: randomWorkingHours(),
						logo: logoResponse.request.res.responseUrl,
						headerImage: headerImageResponse.request.res.responseUrl,
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
	} catch (error) {
		console.error('Error connecting to the database:', error);
	}
})();
