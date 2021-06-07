"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheAppHome from "../components/ main/the-app-home.vue";
import TheShoppingCart from "../components/shoppingCart/the-shopping-cart.vue";
import TheOwnedMessages from "../components/ownedMessages/the-owned-messages";

export default createRouter({
	"base": "/app",
	"history": createWebHistory("/app/"),
	"routes": [
		{
			"name": "app.home",
			"path": "",
			"component": TheAppHome,
			"meta": {
				"indexed": true,
				"home": true
			}
		},
		{
			"name": "app.checkout",
			"path": "/checkout",
			"component": TheShoppingCart,
			"meta": {
				"indexed": true,
			}
		},
		{
			"name": "app.owned",
			"path": "/minhas-mensagens",
			"component": TheOwnedMessages,
			"meta": {
				"indexed": true,
			}
		}
	]
});

