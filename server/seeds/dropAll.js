require('dotenv').config({ path: '../../.env' });

const { connectDB, mongoose } = require('../config/database');

(async () => {
	try {
		await connectDB(); // Connect to the database using the imported function

		// Drop the users collection
		await mongoose.connection.collection('users').drop((err) => {
			if (err) {
				console.error('Error dropping users collection:', err);
			} else {
				console.log('Dropped users collection');
			}
		});

		// Drop the restaurants collection
		await mongoose.connection.collection('restaurants').drop((err) => {
			if (err) {
				console.error('Error dropping restaurants collection:', err);
			} else {
				console.log('Dropped restaurants collection');
			}
		});

		// Drop the orders collection
		await mongoose.connection.collection('orders').drop((err) => {
			if (err) {
				console.error('Error dropping orders collection:', err);
			} else {
				console.log('Dropped orders collection');
			}
		});
	} catch (error) {
		console.error('Error connecting to the database:', error);
	} finally {
		mongoose.connection.close();
	}
})();
