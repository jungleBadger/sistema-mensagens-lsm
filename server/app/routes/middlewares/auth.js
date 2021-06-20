"use strict";


const { validateJWT } = require("../../helpers/security");

module.exports = {
	isLoggedIn(req, res, next) {
		return req.user && req.user.id ? next() : res.redirect("/auth/login");
	},

	isAdmin(req, res, next) {
		return req.user && req.user.isAdmin ? next() : res.redirect("/auth/login");
	},

	async validateJWT(req, res, next) {
		let decodedJWT = await validateJWT(res.locals.apiKey);
		if (decodedJWT) {
			res.locals.decodedJWT = decodedJWT;
		}
		next();
	}

};
