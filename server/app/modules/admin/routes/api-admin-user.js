"use strict";

const express = require("express");
const router = express.Router();
const isAdmin = (req, res, next) => { return next(); }

router.post(
	"/",
	isAdmin,
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

router.get(
	"/",
	isAdmin,
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

router.get(
	"/:adminUserId",
	isAdmin,
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

router.patch(
	"/:adminUserId",
	isAdmin,
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

router.delete(
	"/:adminUserId",
	isAdmin,
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

module.exports = router;