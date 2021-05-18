"use strict";

const express = require("express");
const router = express.Router();
const location = require("../../../helpers/location/crud");
const { isAdmin, isLoggedIn } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/location:
 *   post:
 *     tags: [location]
 *     summary: Create a new Location.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: displayName
 *        in: body
 *        required: true
 *        description: Brother's display name.
 *        schema:
 *          type: string
 *     responses:
 *       201:
 *         description: Brother object created.
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
			await location.create(
				req.body,
				req.user
			)
		)
	}
);


router.get(
	"/count",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await location.retrieveTotalRowsCount()
		);
	}
);


/**
 * @swagger
 * /api/location/search:
 *   delete:
 *     tags: [location]
 *     summary: Search brothers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Brother object updated.
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
			await location.search(
				req.query.filterText,
				req.query.filterColumn || "PAIS",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"PAIS",
					"ESTADO",
					"CIDADE",
					"DESCRICAO",
					"CRIADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "PAIS",
				req.query.orderDirection || "ASC"
			)
		)
	}
);


router.get(
	"/",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await location.retrieveAll(
				[
					"ID",
					"PAIS",
					"ESTADO",
					"CIDADE",
					"DESCRICAO",
					"CRIADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "PAIS",
				req.query.orderDirection || "ASC"
			)
		);
	}
);

router.get(
	"/:locationId",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await location.retrieveById(
				req.params.locationId
			)
		);

	}
);


/**
 * @swagger
 * /api/location/:locationId:
 *   patch:
 *     tags: [location]
 *     summary: Updates a given location.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: displayName
 *        in: body
 *        required: true
 *        description: Brother's display name.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Brother object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Brother not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.patch(
	"/:locationId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await location.update(
				req.params.locationId,
				req.body,
				req.user
			)
		)
	}
)

/**
 * @swagger
 * /api/location/:locationId:
 *   delete:
 *     tags: [location]
 *     summary: Deletes a given location.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Brother object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Brother not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.delete(
	"/:locationId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await location.delete(
				req.params.locationId,
				req.user
			)
		)
	}
);




module.exports = router;