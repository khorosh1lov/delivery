// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

const remoteUrl = 'mongodb+srv://delivery-app-user:FwDTveu4Z6fxbMUY@delivery-app-db.kimyhfv.mongodb.net/?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
const localUrl = 'mongodb://localhost:27017/delivery';

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const useLocalDb = process.env.USE_LOCAL_DB === 'true';
const dbUrl = useLocalDb ? localUrl : remoteUrl;

// DB Connection
mongoose
	.connect(dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected correctly to DB server');
	})
	.catch((err) => {
		console.log(err.stack);
	});

// Init App
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

// Main Server Error
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broken!');
});

// Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
