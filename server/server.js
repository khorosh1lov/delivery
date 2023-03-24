// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

const url = 'mongodb+srv://delivery-app-user:FwDTveu4Z6fxbMUY@delivery-app-db.kimyhfv.mongodb.net/?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// DB Connection
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected correctly to server');
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
