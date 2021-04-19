"use strict";

const router = require("express").Router();

const adminUserAPIs = require("./apiAdminUser");
const viewRoutes = require("./view");
const { isAdmin } = require("../../middlewares/auth");
const { storeOriginalURL } = require("../../middlewares/util");


router.use(
	"/api/admin/user",
	isAdmin,
	adminUserAPIs
);

router.use(
	"/admin",
	storeOriginalURL,
	isAdmin,
	viewRoutes
);


module.exports = router




