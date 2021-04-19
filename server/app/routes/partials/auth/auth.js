"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
	"/login",
	passport.authenticate("local", {}, undefined),
	(req, res) => {
		return (
			req.query.hasOwnProperty("rest") ?
				res.status(200).send("ok") :
				res.redirect(
				req.session.originalUrl ? req.session.originalUrl : req.user && req.user.isAdmin ? "/admin" : "/"
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
		return res.status(200).send("Logged out.");
	}
);

module.exports = router;