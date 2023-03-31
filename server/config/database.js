const mongoose = require('mongoose');
const { NotFoundError, ForbiddenError } = require('../errors');

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
		// Use custom error classes based on the error message or error code
		if (err.message.includes('not found')) {
			throw new NotFoundError(err.message);
		} else if (err.message.includes('forbidden')) {
			throw new ForbiddenError(err.message);
		} else {
			throw err;
		}
	}
};

module.exports = { connectDB, dbUrl, mongoose };
