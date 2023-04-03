function dummyAuth(req, res, next) {
	// Set a dummy user object for development purposes
	req.user = {
		_id: '642a2e2c96c5157f8455043d',
		role: 'admin',
	};
	next();
}

module.exports = dummyAuth;
