"use strict";

const router = require("express").Router();

const brotherAPIs = require("./apiBrothers");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/brother",
	brotherAPIs
);



module.exports = router




