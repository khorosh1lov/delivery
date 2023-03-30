function handleFavicon(req, res, next) {
	if (req.url === '/favicon.ico') {
		res.status(204).end();
	} else {
		next();
	}
}

module.exports = handleFavicon;