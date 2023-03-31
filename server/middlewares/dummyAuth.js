function dummyAuth(req, res, next) {
	// Set a dummy user object for development purposes
	req.user = {
		_id: '642652635bd781ad3b36d15c',
		role: 'admin',
	};
	next();
}

module.exports = dummyAuth;
