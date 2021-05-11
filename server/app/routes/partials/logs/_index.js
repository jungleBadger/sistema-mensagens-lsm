"use strict";

const router = require("express").Router();

const logsAPIs = require("./apiLogs");

router.use(
	"/api/logs",
	logsAPIs
);



module.exports = router




