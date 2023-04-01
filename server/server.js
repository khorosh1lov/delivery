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
const uploadsRouter = require('./routes/uploads');

// Middleware
const { setUser } = require('./middlewares/user');
//const { handleFavicon } = require('./middlewares/handleFavicon');

// DB Connection
connectDB();

// Init App
const app = express();
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// CORS config
const corsOptions = {
	origin: process.env.FRONT_END_APP_URL || 'https://delivery-front-app.herokuapp.com',
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.FRONT_END_APP_URL);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});
app.options('*', cors(corsOptions));

app.use(express.json());

// Use handleFavicon Middleware: Favicon avoiding, remove after development
//app.use(handleFavicon);

// Use setUser Middleware
app.use(setUser); 

// Error Classes
const {
	NotFoundError,
	InternalServerError,
} = require('./errors');

// Passport configuration
passportConfig(app);

// Use Routes
app.use('/', restaurantsRouter);
app.use('/upload', uploadsRouter);
app.use('/orders', ordersRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);

// 404 Not Found Error
app.use((req, res, next) => {
	next(new NotFoundError('Page not found'));
});

// Main Server Error
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
	const message = err.message || 'Internal Server Error';
	console.error(err.stack);
	res.status(statusCode).json({ status: statusCode, code: errorCode, error: message });
});

// Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
