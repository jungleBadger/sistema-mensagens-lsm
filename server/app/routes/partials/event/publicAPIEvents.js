"use strict";

const express = require("express");
const router = express.Router();
const event = require("../../../helpers/event/publicRetrieval");

router.get(
	"/count",
	async (req, res) => {
		res.status(200).send(
			await event.retrieveTotalRowsCount()
		);
	}
);


/**
 * @swagger
 * /api/event/search:
 *   get:
 *     tags: [event]
 *     summary: Search brothers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Event object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/search",
	async (req, res) => {
		res.status(
			200
		).send(
			await event.search(
				req.query.filterText,
				req.query.filterColumn || "TITULO",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [""],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"EVENTO.ID",
					"EVENTO.TITULO",
					"EVENTO.DATA_INICIO",
					"EVENTO.DATA_FIM",
					"EVENTO.DESCRICAO",
					"EVENTO.LOCALIDADE_ID",
					"EVENTO.CATEGORIA_ID",
					"EVENTO.CRIADO_EM",
					"EVENTO.ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC"
			)
		)
	}
);


router.post(
	"/advanced-search",
	async (req, res) => {
		res.status(
			200
		).send(
			await event.advancedSearch(
				req.body,
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"EVENTO.ID",
					"EVENTO.TITULO",
					"EVENTO.DATA_INICIO",
					"EVENTO.DATA_FIM",
					"EVENTO.DESCRICAO",
					"EVENTO.LOCALIDADE_ID",
					"EVENTO.CATEGORIA_ID",
					"EVENTO.CRIADO_EM",
					"EVENTO.ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC",
				req.user ? req.user.id : ""
			)
		)
	}
);


router.get(
	"/",
	async (req, res) => {
		res.status(200).send(
			await event.retrieveAll(
				[
					"EVENTO.ID",
					"EVENTO.TITULO",
					"EVENTO.DATA_INICIO",
					"EVENTO.DATA_FIM",
					"EVENTO.LOCALIDADE_ID",
					"EVENTO.DESCRICAO",
					"EVENTO.CATEGORIA_ID",
					"EVENTO.CRIADO_EM",
					"EVENTO.ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "ASC"
			)
		);
	}
);

router.get(
	"/:eventId",
	async (req, res) => {
		res.status(200).send(
			await event.retrieveById(
				req.params.eventId
			)
		);

	}
);


module.exports = router;