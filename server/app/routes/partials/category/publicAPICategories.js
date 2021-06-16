"use strict";

const express = require("express");
const router = express.Router();
const category = require("../../../helpers/category/crud");

router.get(
	"/count",
	async (req, res) => {
		res.status(200).send(
			await category.retrieveTotalRowsCount()
		);
	}
);


router.get(
	"/",
	async (req, res) => {
		res.status(200).send(
			await category.retrieveAll(
				[
					"*"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC"
			)
		);
	}
);


module.exports = router;