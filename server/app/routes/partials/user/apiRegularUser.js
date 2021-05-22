"use strict";

const express = require("express");
const router = express.Router();
const regularUser = require("../../../helpers/user/userCRUD");
const { isAdmin } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [regular_user]
 *     summary: Create a new regular user.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: email
 *        in: body
 *        required: true
 *        description: regular User email.
 *        schema:
 *          type: string
 *      - name: password
 *        in: body
 *        required: true
 *        description: regular User password that will be hashed.
 *        schema:
 *          type: string
 *      - name: displayName
 *        in: body
 *        required: false
 *        description: Optional user display name.
 *        schema:
 *          type: string
 *     responses:
 *       201:
 *         description: regular user created.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an regular User.
 *       409:
 *         description: User email already exists.
 *       500:
 *         description: Error handler.
 */
router.post(
	"/",
	async (req, res) => {
		res.status(
			201
		).send(
			await regularUser.create(
				req.body.email,
				req.body.password,
				req.body.displayName,
				false,
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
			await regularUser.retrieveTotalRowsCount()
		);
	}
);
/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [regular_user]
 *     summary: Paginate regular users.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: limit
 *        in: query
 *        required: false
 *        default: 20
 *        description: Limit the result set.
 *        schema:
 *          type: string
 *      - name: skip
 *        in: query
 *        required: false
 *        default: 0
 *        description: Skip rows.
 *        schema:
 *          type: string
 *      - name: orderBy
 *        in: query
 *        required: false
 *        default: ID
 *        description: Sorting field - defaults to ID.
 *        schema:
 *          type: string
 *      - name: orderDirection
 *        in: query
 *        required: false
 *        default: DESC
 *        description: Sorting direction - defaults to DESC.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: List of regular Users.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an regular User.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await regularUser.retrieveAll(
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"CRIADO_EM",
					"ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ATUALIZADO_EM",
				req.query.orderDirection || "DESC"
			)
		)
	}
);

/**
 * @swagger
 * /api/user/id/:userId:
 *   get:
 *     tags: [regular_user]
 *     summary: Get regular User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: ID to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: regular User object.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an regular User.
 *       404:
 *         description: regular User not found.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/id/:userId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await regularUser.retrieveById(
				req.params.userId,
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"CRIADO_EM",
					"ATUALIZADO_EM"
				]
			)
		)
	}
);


/**
 * @swagger
 * /api/admin/user/search:
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
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await regularUser.search(
				req.query.filterText,
				req.query.filterColumn || "EMAIL",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"CRIADO_EM",
					"ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ATUALIZADO_EM",
				req.query.orderDirection || "DESC"
			)
		)
	}
);

/**
 * @swagger
 * /api/user/email/:userEmail:
 *   get:
 *     tags: [regular_user]
 *     summary: Get regular User by Email.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userEmail
 *        in: path
 *        required: true
 *        description: Email to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: regular User object.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an regular User.
 *       404:
 *         description: regular User not found.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/email/:userEmail",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await regularUser.retrieveByEmail(
				req.params.userEmail,
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"CRIADO_EM",
					"ATUALIZADO_EM"
				]
			)
		)
	}
);

router.patch(
	"/:userId",
	(req, res) => res.status(200).send("OK")
);

/**
 * @swagger
 * /api/user/:userId:
 *   delete:
 *     tags: [regular_user]
 *     summary: Delete an regular User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: ID to search for and delete.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Successful operation.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an regular User.
 *       404:
 *         description: regular User not found.
 *       500:
 *         description: Error handler.
 */
router.delete(
	"/:userId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await regularUser.delete(
				req.params.userId,
				req.user
			)
		)
	}
);


module.exports = router;