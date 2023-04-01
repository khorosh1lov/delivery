require('dotenv').config({ path: '../../.env' });

const faker = require('faker');
const Restaurant = require('../models/resto');
const Dish = require('../models/dish');
const { connectDB, mongoose } = require('../config/database');
const axios = require('axios');

const API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

const fetchImages = async (query, width, height, perPage = 10, page = 1) => {
	try {
		const response = await axios.get(PEXELS_API_URL, {
			headers: {
				Authorization: API_KEY,
			},
			params: {
				query,
				per_page: perPage,
				page,
			},
		});

		const photos = response.data.photos.map((photo) => {
			const url = new URL(photo.src.medium);
			url.searchParams.set('w', width);
			url.searchParams.set('h', height);
			return {
				...photo,
				src: {
					...photo.src,
					medium: url.href,
				},
			};
		});

		return photos;
	} catch (error) {
		console.error('Error fetching images from Pexels:', error);
		return [];
	}
};


(async () => {
	try {
		await connectDB();

		async function generateDishes() {
			const dishes = [];
			const dishCount = faker.datatype.number({ min: 3, max: 7 });

			const foodImages = await fetchImages('food', 400, 400, dishCount);

			for (let i = 0; i < dishCount; i++) {
				const image = foodImages[i] ? foodImages[i].src.medium : '';

				dishes.push(
					new Dish({
						name: faker.random.words(2),
						description: faker.lorem.sentence(),
						category: faker.random.arrayElement(['Main Course', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Drink', 'Snack', 'BBQ', 'Grill']),
						price: faker.commerce.price(5, 25),
						specialOffer: 'none',
						image: image,
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
				const logoImages = await fetchImages('logo', 400, 400, 25);
				const headerImages = await fetchImages('cafe', 720, 360, 25);
				
				for (let i = 0; i < 25; i++) {
					const dishes = await generateDishes();
					const logo = logoImages[i] ? logoImages[i].src.medium : '';
					const headerImage = headerImages[i] ? headerImages[i].src.medium : '';

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
						logo: logo,
						headerImage: headerImage,
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
