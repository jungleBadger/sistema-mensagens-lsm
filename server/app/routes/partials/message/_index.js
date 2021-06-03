"use strict";

const router = require("express").Router();

const messageAPIs = require("./apiMessages");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/message",
	messageAPIs
);



module.exports = router




