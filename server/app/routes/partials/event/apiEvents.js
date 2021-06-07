"use strict";

const express = require("express");
const router = express.Router();
const event = require("../../../helpers/event/crud");
const { isAdmin } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/event:
 *   post:
 *     tags: [event]
 *     summary: Create a new Event.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: displayName
 *        in: body
 *        required: true
 *        description: Event's display name.
 *        schema:
 *          type: string
 *     responses:
 *       201:
 *         description: Event object created.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.post(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(
			201
		).send(
			await event.create(
				req.body,
				req.user
			)
		)
	}
);


router.get(
	"/count",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveTotalRowsCount()
		);
	}
);


/**
 * @swagger
 * /api/event/search:
 *   delete:
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
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await event.search(
				req.query.filterText,
				req.query.filterColumn || "TITULO",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"EVENTO.ID",
					"EVENTO.TITULO",
					"EVENTO.DATA_INICIO",
					"EVENTO.DATA_FIM",
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


router.get(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveAll(
				[
					"ID",
					"TITULO",
					"DATA_INICIO",
					"DATA_FIM",
					"LOCALIDADE_ID",
					"CATEGORIA_ID",
					"CRIADO_EM",
					"ATUALIZADO_EM"
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
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await event.retrieveById(
				req.params.eventId
			)
		);

	}
);


/**
 * @swagger
 * /api/event/:eventId:
 *   patch:
 *     tags: [event]
 *     summary: Updates a given event.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: displayName
 *        in: body
 *        required: true
 *        description: Event's display name.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Event object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Event not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.patch(
	"/:eventId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await event.update(
				req.params.eventId,
				req.body,
				req.user
			)
		)
	}
)

/**
 * @swagger
 * /api/event/:eventId:
 *   delete:
 *     tags: [event]
 *     summary: Deletes a given event.
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
 *       404:
 *         description: Event not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.delete(
	"/:eventId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await event.delete(
				req.params.eventId,
				req.user
			)
		)
	}
);




module.exports = router;