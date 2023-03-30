class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 404;
	}
}

class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 403;
	}
}

module.exports = { NotFoundError, ForbiddenError };
