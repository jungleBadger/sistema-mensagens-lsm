
const express = require("express");
const router = express.Router();
const logger = require("../../../helpers/logger");
const { isAdmin, isLoggedIn } = require("../../middlewares/auth");

/**
 * @swagger
 * /api/logs/self:
 *   get:
 *     tags: [logs]
 *     summary: Get logger user's log entries.
 *     produces:
 *       - application/json
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Array of logs.
 *       400:
 *         description: Invalid parameters.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/self",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await logger.retrieveByOperatorId(
				req.user.id
			)
		);

	}
);

/**
 * @swagger
 * /api/logs/self:
 *   get:
 *     tags: [logs]
 *     summary: Get logger user's log entries.
 *     produces:
 *       - application/json
 *     security:
 *      - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Array of logs.
 *       400:
 *         description: Invalid parameters.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await logger.retrieveAll(
				[
					"*"
				],
				req.query.limit || 20,
				req.query.skip || 0,
				req.query.orderBy || "CRIADO_EM"
			)
		);

	}
);




module.exports = router;