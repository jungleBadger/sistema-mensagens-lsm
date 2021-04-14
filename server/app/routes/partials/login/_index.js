"use strict";

const router = require("express").Router();

const viewRoutes = require("./view");
const authRoutes = require("./auth");


router.use(
	"/login",
	viewRoutes
);

router.use(
	"/auth",
	authRoutes
);


module.exports = router




