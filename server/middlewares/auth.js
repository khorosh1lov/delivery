const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { UnauthorizedError } = require('../errors');
const User = require('../models/user');

async function ensureAuth(req, res, next) {
	const token = req.header('Authorization')?.split(' ')[1];

	if (!token) {
		return next(new UnauthorizedError('Access denied. No token provided.'));
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = await User.findById(decoded.id);
		if (!req.user) {
			return next(new UnauthorizedError('The user associated with this token no longer exists.'));
		}
		next();
	} catch (error) {
		next(new UnauthorizedError('Invalid token.'));
	}
}

module.exports = ensureAuth;
