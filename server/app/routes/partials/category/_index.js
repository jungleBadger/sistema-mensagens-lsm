"use strict";

const router = require("express").Router();

const categoryAPIs = require("./apiCategories");
const publicAPICategories = require("./publicAPICategories");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/category",
	categoryAPIs
);

router.use(
	"/public/api/category",
	publicAPICategories
);



module.exports = router




