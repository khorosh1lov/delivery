require('dotenv').config({ path: '../../.env' });

const User = require('../models/user');
const Restaurant = require('../models/resto');
const Order = require('../models/order');
const faker = require('faker');
const bcrypt = require('bcrypt');
const { connectDB, mongoose } = require('../config/database');

(async () => {
	try {
		await connectDB(); // Connect to the database using the imported function

		async function createUserWithOrders() {
			try {
				const userCount = faker.datatype.number({ min: 30, max: 50 });

				for (let i = 0; i < userCount; i++) {
					const plainPassword = faker.internet.password();
					const hashedPassword = await bcrypt.hash(plainPassword, 10);

					const newUser = new User({
						name: `${faker.name.firstName()} ${faker.name.lastName()}`,
						email: faker.internet.email(),
						password: hashedPassword,
						address: {
							street: faker.address.streetAddress(),
							city: faker.address.city(),
							state: faker.address.stateAbbr(),
							zip: faker.address.zipCode(),
						},
						phone: faker.phone.phoneNumber(),
					});

					const savedUser = await newUser.save();
					console.log('User created:', savedUser);

					const orderCount = faker.datatype.number({ min: 1, max: 5 });

					let orders = [];

					for (let j = 0; j < orderCount; j++) {
						const restaurant = await Restaurant.aggregate([{ $sample: { size: 1 } }]).exec();
						const chosenRestaurant = restaurant[0];

						if (!chosenRestaurant) {
							console.error('Error: Restaurant not found');
							return;
						}

						const dishCount = chosenRestaurant.dishes.length;
						const dish1 = chosenRestaurant.dishes[faker.datatype.number({ min: 0, max: dishCount - 1 })];
						const dish2 = chosenRestaurant.dishes[faker.datatype.number({ min: 0, max: dishCount - 1 })];

						const order = {
							user: savedUser._id,
							items: [
								{
									dish: dish1._id,
									quantity: faker.datatype.number({ min: 1, max: 3 }),
									restaurant: chosenRestaurant._id,
								},
								{
									dish: dish2._id,
									quantity: faker.datatype.number({ min: 1, max: 3 }),
									restaurant: chosenRestaurant._id,
								},
							],
							totalPrice: dish1.price + dish2.price,
							deliveryAddress: savedUser.address,
						};

						orders.push(order);
					}

					const savedOrders = await Order.insertMany(orders);
					console.log('Orders created:', savedOrders);
				}
			} catch (error) {
				console.error('Error while creating users and order:', error);
			} finally {
				mongoose.connection.close();
			}
		}

		createUserWithOrders();
	} catch (error) {
		console.error('Error connecting to the database:', error);
	}
})();
