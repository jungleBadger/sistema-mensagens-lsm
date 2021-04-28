"use strict";

const router = require("express").Router();

const recaptchaAPI = require("./recaptcha");

router.use(
	"/api/recaptcha",
	recaptchaAPI
);



module.exports = router




