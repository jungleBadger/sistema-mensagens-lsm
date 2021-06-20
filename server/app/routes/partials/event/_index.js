"use strict";

const router = require("express").Router();

const eventAPIs = require("./apiEvents");
const publicAPIEvents = require("./publicAPIEvents");
const privateAPIEvents = require("./privateAPIEvents");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/event",
	eventAPIs
);

router.use(
	"/public/api/event",
	publicAPIEvents
);

router.use(
	"/private/api/event",
	privateAPIEvents
);



module.exports = router




