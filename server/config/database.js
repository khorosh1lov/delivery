// database.js
const mongoose = require('mongoose');

const remoteUrl = process.env.MONGODB_URI;
const localUrl = 'mongodb://localhost:27017/delivery';

const useLocalDb = process.env.USE_LOCAL_DB === 'true';
const dbUrl = useLocalDb ? localUrl : remoteUrl;

const connectDB = async () => {
	try {
		await mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected correctly to DB server');
	} catch (err) {
		console.log(err.stack);
		process.exit(1);
	}
};

module.exports = { connectDB, dbUrl };
