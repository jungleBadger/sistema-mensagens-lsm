"use strict";

const express = require("express");
const router = express.Router();
const brother = require("../../../helpers/brother/crud");
const { isAdmin } = require("../../middlewares/auth");

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

module.exports = router;