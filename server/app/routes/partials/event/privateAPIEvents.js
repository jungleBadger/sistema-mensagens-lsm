"use strict";

const express = require("express");
const router = express.Router();
const event = require("../../../helpers/event/privateRetrieval");
const { isLoggedIn } = require("../../middlewares/auth");

router.get(
	"/count",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveTotalRowsCount(req.user.id)
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
	isLoggedIn,
	async (req, res) => {
		res.status(
			200
		).send(
			await event.search(
				req.user.id,
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
	isLoggedIn,
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
				req.user.id
			)
		)
	}
);


router.get(
	"/",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveAll(
				req.user.id,
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
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveById(
				req.user.id,
				req.params.eventId
			)
		);

	}
);


module.exports = router;