"use strict";

const express = require("express");
const router = express.Router();
const location = require("../../../helpers/location/crud");

router.get(
	"/count",
	async (req, res) => {
		res.status(200).send(
			await location.retrieveTotalRowsCount()
		);
	}
);


router.get(
	"/",
	async (req, res) => {
		res.status(200).send(
			await location.retrieveAll(
				[
					"ID",
					"PAIS",
					"ESTADO",
					"CIDADE",
					"DESCRICAO",
					"CRIADO_EM",
					"(PAIS concat ' - ' concat CIDADE concat ' - ' concat ESTADO) AS LOCALIDADE"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "PAIS",
				req.query.orderDirection || "ASC"
			)
		);
	}
);


module.exports = router;