const express = require("express");
const router = express.Router();
const logger = require("../../../helpers/logger");
const {
	isAdmin,
	isLoggedIn
} = require("../../middlewares/auth");

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
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await logger.search(
				req.query.filterText,
				req.query.filterColumn || "OPERADOR_FANTASIA",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"OPERADOR_FANTASIA",
					"REFERENCIA_TABELA",
					"ACAO",
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
 * /api/logs/count:
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
	"/count",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await logger.retrieveTotalRowsCount()
		);

	}
);

/**
 * @swagger
 * /api/logs/:logId:
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
	"/:logId",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await logger.retrieveById(
				req.params.logId
			)
		);

	}
);

/**
 * @swagger
 * /api/logs/:
 *   get:
 *     tags: [logs]
 *     summary: Get logger user's log entries.
 *     produces:
 *       - application/json
 *     security:
 *      - ApiKeyAuth: []
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
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC"
			)
		);
	}
);

module.exports = router;