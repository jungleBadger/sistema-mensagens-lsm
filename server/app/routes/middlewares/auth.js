"use strict";

module.exports = {
	isLoggedIn(req, res, next) {
		return req.user && req.user.id ? next() : res.redirect("/auth/login");
	},

	isAdmin(req, res, next) {
		return req.user && req.user.isAdmin ? next() : res.redirect("/auth/login");
	}
};
