"use strict";

const express = require("express");
const router = express.Router();
const shoppingCart = require("../../../helpers/orders/shoppingCart");
const { isLoggedIn } = require("../../middlewares/auth");


router.post("/",
	isLoggedIn,
	async (req, res) => {
		return res.status(201).send(await shoppingCart.createCart(req.user.id));
	}
);

router.put("/add",
	isLoggedIn,
	async (req, res) => {
		return res.status(201).send(await shoppingCart.addItemToCart(req.body.itemId || req.body.messageId, req.user.id));
	}
);

router.delete("/remove/:cartItemId",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await shoppingCart.removeItemFromCart(req.params.cartItemId, req.user.id));
	}
);

router.get("/",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await shoppingCart.retrieveUserCart(req.user.id));
	}
);

router.post("/clear",
	isLoggedIn,
	async (req, res) => {
		return res.status(200).send(await shoppingCart.clearCart(req.user.id));
	}
);




module.exports = router;