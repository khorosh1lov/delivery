// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');

// DB Connection
mongoose.connect('mongodb://localhost:27017/delivery', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Init App
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);

// Main Server Error
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broken!');
});

// Start Server
const port = process.env.PORT || 2200;
app.listen(port, () => {
	console.log(`Server started on port:${port}`);
});
