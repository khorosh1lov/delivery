// Ensures that the user is authenticated
function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ message: 'Please log in to access this resource' });
}

module.exports = ensureAuth;
