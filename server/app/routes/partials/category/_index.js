"use strict";

const router = require("express").Router();

const categoryAPIs = require("./apiCategories");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/category",
	categoryAPIs
);



module.exports = router




