class HttpError extends Error {
	constructor(statusCode, errorCode, message) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}

class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 404;
		this.errorCode = 'NOT_FOUND';
	}
}

class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 403;
		this.errorCode = 'FORBIDDEN';
	}
}

class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 401;
		this.errorCode = 'UNAUTHORIZED';
	}
}

class BadRequestError extends HttpError {
	constructor(message = 'Bad Request') {
		super(400, 'BAD_REQUEST', message);
	}
}

class InternalServerError extends HttpError {
	constructor(message = 'Internal Server Error') {
		super(500, 'INTERNAL_SERVER_ERROR', message);
	}
}

module.exports = {
	NotFoundError,
	ForbiddenError,
	BadRequestError,
	UnauthorizedError,
	InternalServerError,
};
