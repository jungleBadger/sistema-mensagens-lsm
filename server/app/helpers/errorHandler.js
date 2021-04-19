"use strict";

/**
 * Error handlers.
 * @module errorHandler
 */
const log = require("debug")("app:helpers:error-handler")

module.exports = {

	/**
	 * Receive an Express Response object and an error message declaring the status and return message returning the processed response.
	 *
	 * @see {@link https://expressjs.com/en/5x/api.html#res} for Express Response documentation
	 * @function handleExpressError
	 * @param {Object|string} err - The error representation to be handled.
	 * @param {number} [err.status=500] - The error HTTP status code.
	 * @param {string} err.message - The error message.
	 * @param {Response} expressResponse - The express response object
	 * @return {Response} The express processed response object
	 */
	handleExpressError(err, expressResponse) {
		log(err);
		try {
			if (Object.prototype.hasOwnProperty.call(err, "status")) {
				return expressResponse.status(err.status || 500).send(err.message || err);
			} else {
				let parsedError = JSON.parse(err.message);
				return expressResponse.status(parsedError.status || 500).send(parsedError.message || err.message || "Unknown Error");
			}
		} catch (e) {
			return expressResponse.status(err.status || 500).send(err.message || err);
		}
	},

	/**
	 * Receive an error object representation and returns a new native error object constructed with the Error constructor.
	 *
	 * @function raiseError
	 * @param {number} [status=500] - The error HTTP status code.
	 * @param {string} [message="Unknown error"] - The error message.
	 * @return {Error} The error object constructed
	 */
	raiseError(status = 500, message = "Unknown error") {
		return new Error(JSON.stringify({status, message}));
	}
};