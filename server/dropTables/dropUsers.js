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
	} catch (error) {
		console.error('Error connecting to the database:', error);
	} finally {
		mongoose.connection.close();
	}
})();
