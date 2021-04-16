"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
	"/login",
	passport.authenticate("local", { "successRedirect": "/" }, undefined),
	function(req, res) {
		res.redirect('/');
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