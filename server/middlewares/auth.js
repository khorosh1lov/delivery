const { UnauthorizedError } = require('../errors');

// Ensures that the user is authenticated
function ensureAuth(req, res, next) {
	// TODO: Replace this with proper authentication using JWT or similar.
	console.warn('Warning: Authentication is currently disabled. Implement proper authentication before deploying to production.');
	return next();
}

module.exports = ensureAuth;
