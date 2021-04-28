"use strict";

const express = require("express");
const router = express.Router();
const { validateRecaptcha } = require("../../../helpers/recaptcha");

/**
 * @swagger
 * /api/recaptcha/:
 *   get:
 *     tags: [admin_user]
 *     summary: Get admin User by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: recaptchaData
 *        in: body
 *        required: true
 *        description: Recaptcha value.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Request accepted.
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
router.post(
	"/",

	async (req, res) => {
		res.status(
			200
		).send(
			await validateRecaptcha(
				req.body.recaptchaData
			)
		)
	}
);


module.exports = router;