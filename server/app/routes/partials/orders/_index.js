"use strict";

const router = require("express").Router();

const shoppingCartAPIs = require("./apiShoppingCart");
const orderAPIs = require("./apiOrders");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/self/cart",
	shoppingCartAPIs
);

router.use(
	"/api/order",
	orderAPIs
);



module.exports = router




