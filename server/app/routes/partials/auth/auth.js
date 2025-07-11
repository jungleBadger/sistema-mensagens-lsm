"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
	"/login",
	passport.authenticate("local", {}, undefined),
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



router.get(
	"/me",
	(req, res) => res.status(200).send(req.user || {})
);

router.all(
	"/logout",
	(req, res) => {
		req.logout();
		req.session = null;
		return res.redirect("/app");
	}
);

module.exports = router;