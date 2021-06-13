"use strict";

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middlewares/auth");
const order = require("../../../helpers/orders/order");

router.patch("/:orderId/validate",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.validateOrder(req.params.orderId, req.user.id));
	}
);

router.post("/:orderId/update", async (req, res) => {
	return res.status(200).send(await order.processOrder(req.params.orderId, req.body));
});


module.exports = router;