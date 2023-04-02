// .ENV
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Imports
const express = require('express');
const bodyParser = require('body-parser');
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

// Set the payload size limit to 1 MB
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// CORS config
const corsOptions = {
	origin: function (origin, callback) {
		const allowedOrigins = [process.env.FRONT_END_APP_URL || 'https://delivery-front-app.herokuapp.com', 'http://localhost:3000', '*'];

		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200,
	allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	methods: 'GET, POST, PUT, DELETE, OPTIONS',
	credentials: true,
};

app.use(cors(corsOptions));


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
