"use strict";

const router = require("express").Router();

const adminUserAPIs = require("./apiAdminUser");
const viewRoutes = require("./view");


router.use(
	"/api/admin/user",
	adminUserAPIs
);

router.use(
	"/admin",
	viewRoutes
);


module.exports = router




