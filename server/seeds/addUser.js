const mongoose = require('mongoose');
const User = require('../models/user');
const Restaurant = require('../models/resto');
const Order = require('../models/order');
const faker = require('faker');
const bcrypt = require('bcrypt');

const remoteUrl = 'mongodb+srv://delivery-app-user:FwDTveu4Z6fxbMUY@delivery-app-db.kimyhfv.mongodb.net/?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';

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

async function createUserWithOrders() {
	try {
		const userCount = faker.datatype.number({ min: 20, max: 30 });

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

			const orderCount = faker.datatype.number({ min: 2, max: 5 });

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
