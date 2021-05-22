"use strict";

const express = require("express");
const router = express.Router();
const regularUser = require("../../../helpers/user/userCRUD");
const commonUser = require("../../../helpers/user/userCommon");
const { extractAndLoadAPIKey } = require("../../middlewares/util");
const {
	validateJWT,
	isAdmin
} = require("../../middlewares/auth");

/**
 * @swagger
 * /api/common/user/confirm:
 *   patch:
 *     tags: [common_user]
 *     summary: Get regular User by Email.
 *     produces:
 *       - application/json
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User email has been confirmed.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Expired JWT.
 *       404:
 *         description: regular User not found.
 *       422:
 *         description: Invalid JWT.
 *       500:
 *         description: Error handler.
 */
router.all(
	"/confirm",
	extractAndLoadAPIKey,
	validateJWT,
	async (req, res) => {
		await regularUser.updateAccountConfirmation(
			res.locals.decodedJWT.userEmail
		);
		res.redirect("/");
	}
);

/**
 * @swagger
 * /api/common/user/:userId/:
 *   patch:
 *     tags: [common_user]
 *     summary: Get regular User by Email.
 *     produces:
 *       - application/json
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User email has been confirmed.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Expired JWT.
 *       404:
 *         description: regular User not found.
 *       422:
 *         description: Invalid JWT.
 *       500:
 *         description: Error handler.
 */
router.patch(
	"/:userId",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await regularUser.updateProfile(
				req.params.userId,
				req.body.displayName,
				req.body.isAdmin,
				req.user
			)
		);
	}
);

/**
 * @swagger
 * /api/common/user/request-reset:
 *   post:
 *     tags: [common_user]
 *     summary: Request user's password request.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: email
 *        in: body
 *        required: true
 *        description: User email to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: User email has been confirmed.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Expired JWT.
 *       404:
 *         description: regular User not found.
 *       422:
 *         description: Invalid JWT.
 *       500:
 *         description: Error handler.
 */
router.post(
	"/request-reset",
	async (req, res) => {
		await commonUser.requestPasswordReset(
			req.body.email
		);
		res.status(200).send("ok");
	}
);

/**
 * @swagger
 * /api/common/user/request-reset:
 *   get:
 *     tags: [common_user]
 *     summary: Request user's password request.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: email
 *        in: body
 *        required: true
 *        description: User email to search for.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: User email has been confirmed.
 *       400:
 *         description: Invalid parameters.
 *       401:
 *         description: Expired JWT.
 *       404:
 *         description: regular User not found.
 *       422:
 *         description: Invalid JWT.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/request-reset",
	extractAndLoadAPIKey,
	validateJWT,
	async (req, res) => {
		res.status(200).send(res.locals.decodedJWT);
	}
);

module.exports = router;