"use strict";

const router = require("express").Router();

const locationAPIs = require("./apiLocations");

router.use(
	"/api/location",
	locationAPIs
);

module.exports = router




