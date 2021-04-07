"use strict";

const router = require("express").Router();

const adminUserAPIs = require("./api-admin-user");
const viewRoutes = require("./view");


router.use(
	"/admin/api/user",
	adminUserAPIs
);

router.use(
	"/admin/app",
	viewRoutes
);


module.exports = router




