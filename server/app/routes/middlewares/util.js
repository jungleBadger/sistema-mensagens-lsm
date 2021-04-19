"use strict";

module.exports = {
	storeOriginalURL(req, res, next) {
		req.session.originalUrl = req.originalUrl;
		return next();
	}
};