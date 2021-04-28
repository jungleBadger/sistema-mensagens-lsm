"use strict";

const router = require("express").Router();

const commonUserAPIs = require("./apiCommonUser");
const regularUserAPIs = require("./apiRegularUser");

router.use(
	"/api/common/user",
	commonUserAPIs
);

router.use(
	"/api/regular/user",
	regularUserAPIs
);


module.exports = router




