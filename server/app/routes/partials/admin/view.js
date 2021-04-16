"use strict";

const express = require("express");
const router = express.Router();

router.get(["", "/", "/*"],
	(req, res, next) => {
		req.session.originalUrl = req.originalUrl;
		next();
	},
	(req, res) => res.status(200).render("./admin_module/dist/index.html")
);

module.exports = router;