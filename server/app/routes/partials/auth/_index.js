"use strict";

const router = require("express").Router();

const authRoutes = require("./auth");
const googleAuthRoutes = require("./googleAuth");
const viewRoutes = require("./view");


router.use(
	"/auth",
	authRoutes
);

router.use(
	"/auth",
	googleAuthRoutes
);


router.use(
	"/auth",
	viewRoutes
);




module.exports = router




