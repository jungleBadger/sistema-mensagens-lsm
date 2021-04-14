"use strict";

const express = require("express");
const router = express.Router();
const adminUserFunctionality = require("../../../helpers/user/userCommon");


router.post(
	"/login",
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUserFunctionality.checkPassword(
				req.body.email,
				req.body.password
			)
		)
	}
);


module.exports = router;