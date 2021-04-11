"use strict";

const express = require("express");
const router = express.Router();
const isAdmin = (req, res, next) => { return next(); }
const adminUser = require("../crud/adminUser");

router.post(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(
			201
		).send(
			await adminUser.create(
				req.body.email,
				req.body.rawPassword,
				req.body.displayName
			)
		)
	}
);

router.get(
	"/",
	isAdmin,
	(req, res) => res.status(200).send("OK")
);


router.get(
	"/id/:adminUserId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.retrieveById(
				req.params.adminUserId,
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO"
				]
			)
		)
	}
);


router.get(
	"/email/:adminUserEmail",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.retrieveByEmail(req.params.adminUserEmail)
		)
	}
);

router.patch(
	"/:adminUserId",
	isAdmin,
	(req, res) => res.status(200).send("OK")
);

router.delete(
	"/:adminUserId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.delete(
				req.params.adminUserId
			)
		)
	}
);

module.exports = router;