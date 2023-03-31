function dummyAuth(req, res, next) {
	// Set a dummy user object for development purposes
	req.user = {
		_id: '641d3d0d2025d607296c2cd7',
		role: 'admin',
	};
	next();
}

module.exports = dummyAuth;
