"use strict";

const router = require("express").Router();

const locationAPIs = require("./apiLocations");
const publicAPILocations = require("./publicAPILocations");

router.use(
	"/api/location",
	locationAPIs
);

router.use(
	"/public/api/location",
	publicAPILocations
);

module.exports = router




