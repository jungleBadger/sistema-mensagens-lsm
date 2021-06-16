"use strict";

const router = require("express").Router();

const brotherAPIs = require("./apiBrothers");
const publicAPIBrothers = require("./publicAPIBrothers");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/brother",
	brotherAPIs
);

router.use(
	"/public/api/brother",
	publicAPIBrothers
);


module.exports = router




