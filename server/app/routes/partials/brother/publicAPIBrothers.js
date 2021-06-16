"use strict";

const express = require("express");
const router = express.Router();
const brother = require("../../../helpers/brother/crud");


router.get(
	"/count",
	async (req, res) => {
		res.status(200).send(
			await brother.retrieveTotalRowsCount()
		);
	}
);


router.get(
	"/",
	async (req, res) => {
		res.status(200).send(
			await brother.retrieveAll(
				[
					"ID",
					"NOME_EXIBICAO",
					"CRIADO_EM"
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