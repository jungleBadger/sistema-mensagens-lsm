"use strict";

const router = require("express").Router();

const viewRoutes = require("./view");
const authRoutes = require("./auth");


router.use(
	"/auth",
	authRoutes
);

router.use(
	"/auth",
	viewRoutes
);




module.exports = router




