"use strict";

const router = require("express").Router();

const messageAPIs = require("./apiMessages");
const publicMessageAPIs = require("./publicAPIMessages");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/message",
	messageAPIs
);


router.use(
	"/public/api/message",
	publicMessageAPIs
);



module.exports = router




