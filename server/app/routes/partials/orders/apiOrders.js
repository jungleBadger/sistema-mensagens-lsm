"use strict";

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/auth");
const order = require("../../../helpers/orders/order");
const fs = require("fs").promises;

router.patch("/:orderId/validate",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.validateOrder(req.params.orderId, req.user.id));
	}
);

router.post("/:orderId/update", async (req, res) => {
	console.log("OIIII");
	console.log(req.body);
	return res.status(200).send(await order.processOrder(req.params.orderId, req.body));
});

router.post("/:orderId/test", async (req, res) => {
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