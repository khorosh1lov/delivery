const { UnauthorizedError } = require('../errors');

function ensureAdmin(req, res, next) {
	if (req.user) {
		if (req.user.role === 'admin') {
			return next();
		}
		return next(new UnauthorizedError('Access denied: You do not have admin privileges'));
	}
	return next(new UnauthorizedError('Please log in to access this resource'));
}

module.exports = ensureAdmin;
