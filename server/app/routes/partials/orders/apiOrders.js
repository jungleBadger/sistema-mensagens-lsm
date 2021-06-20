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

router.get("/self",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(
			await order.fetchUserOrders(
				req.user.id,
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "CRIADO_EM",
				req.query.orderDirection || "DESC"
			)
		);
	}
);


router.get(
	"/self/count",
	isLoggedIn,
	async (req, res) => {
		res.status(200).send(
			await order.countUserOrders(req.user.id),
		);
	}
);

router.get(
	"/self/search",
	isLoggedIn,
	async (req, res) => {
		res.status(
			200
		).send(
			await order.searchUserOrders(
				req.user.id,
				req.query.filterText,
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [
					"P.ID",
					"PS.NOME_EXIBICAO",
					"P.CRIADO_EM",
					"P.ATUALIZADO_EM"
				],

				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"P.ID AS PEDIDO_ID",
					"PS.NOME_EXIBICAO AS PEDIDO_STATUS",
					"P.CRIADO_EM",
					"P.ATUALIZADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC"
			)
		)
	}
);

router.get("/pending",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.fetchPendingOrders(req.user.id));
	}
);

router.get("/processed",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.fetchProcessedOrders(req.user.id));
	}
);

router.get("/rejected",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.fetchRejectedOrders(req.user.id));
	}
);

router.patch("/:orderId/validate",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await order.validateOrder(req.params.orderId, req.user.id));
	}
);

router.post("/:orderId/update", async (req, res) => {
	try {
		return res.status(200).send(await order.processOrder(req.params.orderId, req.body));
	} catch (e) {
		console.log(e);
		return res.status(200).send("ok");
	}
});

router.get("/self/owned", async (req, res) => {
	return res.status(200).send(await order.fetchOwnedItems(req.user.id));
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