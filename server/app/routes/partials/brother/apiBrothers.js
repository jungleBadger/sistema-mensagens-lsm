"use strict";

const express = require("express");
const router = express.Router();
const brother = require("../../../helpers/brother/crud");
const { isAdmin, isLoggedIn } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/brother:
 *   post:
 *     tags: [brother]
 *     summary: Create a new Brother.
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
			await brother.create(
				req.body.displayName,
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
			await brother.retrieveTotalRowsCount()
		);
	}
);


/**
 * @swagger
 * /api/brother/search:
 *   delete:
 *     tags: [brother]
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
			await brother.search(
				req.query.filterText,
				req.query.filterColumn || "NOME_EXIBICAO",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"NOME_EXIBICAO",
					"CRIADO_EM"
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
	isLoggedIn,
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

router.get(
	"/:brotherId",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await brother.retrieveById(
				req.params.brotherId
			)
		);

	}
);


/**
 * @swagger
 * /api/brother/:brotherId:
 *   patch:
 *     tags: [brother]
 *     summary: Updates a given brother.
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
	"/:brotherId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await brother.update(
				req.params.brotherId,
				req.body.displayName,
				req.user
			)
		)
	}
)

/**
 * @swagger
 * /api/brother/:brotherId:
 *   delete:
 *     tags: [brother]
 *     summary: Deletes a given brother.
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
	"/:brotherId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await brother.delete(
				req.params.brotherId,
				req.user
			)
		)
	}
);




module.exports = router;