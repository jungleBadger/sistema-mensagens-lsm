"use strict";

const express = require("express");
const router = express.Router();
const adminUser = require("../../../helpers/user/adminUserCRUD");
const { isAdmin } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/admin/user:
 *   post:
 *     tags: [admin_user]
 *     summary: Create a new admin user.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: email
 *        in: body
 *        required: true
 *        description: Admin user email.
 *        schema:
 *          type: string
 *      - name: password
 *        in: body
 *        required: true
 *        description: Admin user password that will be hashed.
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
 *         description: Admin user created.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       409:
 *         description: User email already exists.
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
			await adminUser.create(
				req.body.email,
				req.body.password,
				req.body.displayName,
				req.user
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
			await adminUser.search(
				req.query.filterText,
				req.query.filterColumn || "EMAIL",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"CRIADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "CRIADO_EM",
				req.query.orderDirection || "DESC"
			)
		)
	}
);

router.get(
	"/count",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await adminUser.retrieveTotalRowsCount()
		);
	}
);

/**
 * @swagger
 * /api/admin/user:
 *   get:
 *     tags: [admin_user]
 *     summary: Paginate admin users.
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
 *         description: List of admin Users.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
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
			await adminUser.retrieveAll(
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
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

/**
 * @swagger
 * /api/admin/user/:adminUserId:
 *   get:
 *     tags: [admin_user]
 *     summary: Get admin User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: adminUserId
 *        in: path
 *        required: true
 *        description: ID to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Admin User object.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Admin User not found.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/:adminUserId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.retrieveById(
				req.params.adminUserId,
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO",
					"SENHA_REGISTRADA",
					"EMAIL_CONFIRMADO",
					"ADMINISTRADOR",
					"CRIADO_EM"
				]
			)
		)
	}
);

/**
 * @swagger
 * /api/admin/user/email/:adminUserEmail:
 *   get:
 *     tags: [admin_user]
 *     summary: Get admin User by Email.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: adminUserEmail
 *        in: path
 *        required: true
 *        description: Email to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Admin User object.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Admin User not found.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/email/:adminUserEmail",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.retrieveByEmail(
				req.params.adminUserEmail,
				[
					"ID",
					"EMAIL",
					"NOME_EXIBICAO"
				]
			)
		)
	}
);

router.patch(
	"/:adminUserId",
	isAdmin,
	(req, res) => res.status(200).send("OK")
);

/**
 * @swagger
 * /api/admin/user/:adminUserId:
 *   delete:
 *     tags: [admin_user]
 *     summary: Delete an admin User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: adminUserId
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
 *         description: Requester is not an admin User.
 *       404:
 *         description: Admin User not found.
 *       500:
 *         description: Error handler.
 */
router.delete(
	"/:adminUserId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await adminUser.delete(
				req.params.adminUserId,
				req.user
			)
		)
	}
);

module.exports = router;