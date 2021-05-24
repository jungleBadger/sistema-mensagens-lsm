"use strict";

const express = require("express");
const router = express.Router();
const category = require("../../../helpers/category/crud");
const { isAdmin, isLoggedIn } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/category:
 *   post:
 *     tags: [category]
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
			await category.create(
				req.body.name,
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
			await category.retrieveTotalRowsCount()
		);
	}
);


/**
 * @swagger
 * /api/category/search:
 *   delete:
 *     tags: [category]
 *     summary: Search categories.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Category object updated.
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
			await category.search(
				req.query.filterText,
				req.query.filterColumn || "NOME",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"NOME",
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
	"/:categoryId",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await category.retrieveById(
				req.params.categoryId
			)
		);

	}
);

router.get(
	"/",
	isLoggedIn,
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

/**
 * @swagger
 * /api/category/:categoryId:
 *   patch:
 *     tags: [category]
 *     summary: Updates a given category.
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
	"/:categoryId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await category.update(
				req.params.categoryId,
				req.body.name,
				req.user
			)
		)
	}
);
/**
 * @swagger
 * /api/category/:categoryId:
 *   delete:
 *     tags: [category]
 *     summary: Deletes a given category.
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
	"/:categoryId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await category.delete(
				req.params.categoryId,
				req.user
			)
		)
	}
);


module.exports = router;