const { UnauthorizedError } = require('../errors');

// Ensures that the user is authenticated and has the 'admin' role
function ensureAdmin(req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.role === 'admin') {
			return next();
		}
		return next(new UnauthorizedError('Access denied: You do not have admin privileges'));
	}
	return next(new UnauthorizedError('Please log in to access this resource'));
}

module.exports = ensureAdmin;
