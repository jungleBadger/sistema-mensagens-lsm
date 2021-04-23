"use strict";

const { raiseError } = require("../../helpers/errorHandler");

module.exports = {

	/**
	 * Middleware that store the original URL to be reused in the login redirect at a later time.
	 *
	 * @method storeOriginalURL
	 */
	storeOriginalURL(req, res, next) {
		req.session.originalUrl = req.originalUrl;
		return next();
	},

	/**
	 * Middleware that search for an API key and add it to `res.locals`
	 * The API key can be provided in either of the following ways: Body parameter, query string or Authorization header
	 *
	 * @method extractAndLoadAPIKey
	 */
	extractAndLoadAPIKey(req, res, next) {

		if (req.body && req.body.apiKey) {
			res.locals.apiKey = req.body.apiKey;
		}

		if (!res.locals.apiKey && req.query.apiKey) {
			res.locals.apiKey = req.query.apiKey;
		}

		if (!res.locals.apiKey && req.headers.authorization) {
			res.locals.apiKey = req.headers.authorization.split(" ")[1];
		}

		if (!res.locals.apiKey) {
			throw raiseError(
				400,
				"API key not found"
			);
		}
		next();
	}
};