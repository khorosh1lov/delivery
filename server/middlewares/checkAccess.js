// checkUserAccess.js
const { ForbiddenError } = require('../errors');

function checkUserAccess(req, res, next) {
	if (req.user && req.user._id.toString() === req.params.userId) {
		return next();
	} else {
		return next(new ForbiddenError('Forbidden: Access to the requested resource is denied'));
	}
}

module.exports = checkUserAccess;
