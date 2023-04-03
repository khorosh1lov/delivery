require('dotenv').config({ path: '../../.env' });

const { connectDB, mongoose } = require('../config/database');

(async () => {
	try {
		await connectDB(); // Connect to the database using the imported function

		// Drop the restaurants collection
		await mongoose.connection.collection('restaurants').drop((err) => {
			if (err) {
				console.error('Error dropping restaurants collection:', err);
			} else {
				console.log('Dropped restaurants collection');
			}
		});
	} catch (error) {
		console.error('Error connecting to the database:', error);
	} finally {
		mongoose.connection.close();
	}
})();
