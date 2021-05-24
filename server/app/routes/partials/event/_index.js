"use strict";

const router = require("express").Router();

const eventAPIs = require("./apiEvents");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/event",
	eventAPIs
);



module.exports = router




