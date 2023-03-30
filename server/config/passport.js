const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { dbUrl } = require('./database');

const store = new MongoDBStore({
	uri: dbUrl,
	collection: 'sessions',
});

const passportConfig = (app) => {
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
};

module.exports = passportConfig;
