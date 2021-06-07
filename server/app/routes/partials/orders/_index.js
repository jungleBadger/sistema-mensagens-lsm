"use strict";

const router = require("express").Router();

const shoppingCartAPIs = require("./apiShoppingCart");
// const { isAdmin } = require("../../middlewares/auth");

router.use(
	"/api/self/cart",
	shoppingCartAPIs
);



module.exports = router




