"use strict";

const router = require("express").Router();

const eventAPIs = require("./apiEvents");
const publicAPIEvents = require("./publicAPIEvents");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/event",
	eventAPIs
);
router.use(
	"/public/api/event",
	publicAPIEvents
);



module.exports = router




