"use strict";

const express = require("express");
const router = express.Router();

router.get(["", "/", "/login", "/signup", "/*"],
	(req, res) => {
		return res.status(200).render("./auth_module/dist/index.html");
	}
);

module.exports = router;