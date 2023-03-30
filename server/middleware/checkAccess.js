function checkUserAccess(req, res, next) {
	if (req.user && req.user._id.toString() === req.params.userId) {
		return next();
	} else {
		return res.status(403).json({ message: 'Forbidden: Access to the requested resource is denied' });
	}
}

module.exports = checkUserAccess;
