"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
	"/google",
	(req, res, next) => {
		req.session.requestAction = req.query.action || "login";
		return next();
	},
	passport.authenticate(
		"google",
		{
			"scope": [
				"profile",
				"email"
			]
		},
		undefined
	)
);

router.get(
	"/google/callback",
	passport.authenticate(
		"google",
		{},
		undefined
	),
	(req, res) => {
		let redirectPath = req.user.isAdmin ? (req.session.originalUrl ? req.session.originalUrl : "/") : "/"
		req.session.originalUrl = "";
		return (
			(req.query && req.query.rest ?
				res.status(200).send({
					redirectPath
				}) :
				res.redirect(redirectPath)
			)
		);
	}
);



module.exports = router;