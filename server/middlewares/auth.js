const { UnauthorizedError } = require('../errors');

// Ensures that the user is authenticated
function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return next(new UnauthorizedError('Please log in to access this resource'));
}

module.exports = ensureAuth;
