"use strict";

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/auth");
const order = require("../../../helpers/orders/order");
const fs = require("fs").promises;

router.patch("/:orderId/pending",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.setOrderToPending(req.params.orderId, req.user.id));
	}
);

router.get("/:orderId/accept", (req, res) => {
	return res.status(200).send("ok");
});

router.get("/:orderId/cancel", (req, res) => {
	return res.status(200).send("ok");
});

router.post("/:orderId/update", async (req, res) => {
	await fs.writeFile(`./${Date.now()}_request.log`, JSON.stringify({
		"headers": req.headers,
		"body": req.body,
		"params": {
			...req.params,
			...req.query
		}
	}, null, 4));
	return res.status(200).send("ok");
});


module.exports = router;