// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');

// Routes
const restaurantsRouter = require('./routes/restaurants');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// Middleware
const { setUser } = require('./middleware/user');

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

// Session store
const store = new MongoDBStore({
	uri: dbUrl,
	collection: 'sessions',
});

// Init App
const app = express();
app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'secret',
		resave: false,
		saveUninitialized: false,
		store: store,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(setUser); // Use setUser middleware

// Passport configuration
passport.use(
	new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
		const user = await User.findOne({ email: email });

		if (!user) {
			return done(null, false, { message: 'Incorrect email or password.' });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (isValidPassword) {
			return done(null, user);
		} else {
			return done(null, false, { message: 'Incorrect email or password.' });
		}
	}),
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});

// Use routes
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
