// .ENV
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Imports
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const passportConfig = require('./config/passport');

// Routes
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// Middleware
const { setUser } = require('./middleware/user');

// DB Connection
connectDB();

// Init App
const app = express();
app.use(cors());
app.use(express.json());

// Use setUser Middleware
app.use(setUser); 

// Passport configuration
passportConfig(app);

// Use Routes
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// 404 Not Found Error
app.use((req, res, next) => {
	res.status(404).send('Page not found');
});

// Main Server Error
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	console.error(err.stack);
	res.status(statusCode).send(message);
});

// Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
