"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheAppHome from "../components/ main/the-app-home.vue";
import TheProfileAndOrders from "../components/profileAndOrders/the-profile-and-orders.vue";
import TheOwnedItems from "../components/ownedItems/the-owned-items.vue";

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
			"name": "app.profile",
			"path": "/perfil-e-pedidos",
			"component": TheProfileAndOrders,
			"meta": {
				"indexed": true
			}
		},
		{
			"name": "app.owned",
			"path": "/minhas-mensagens",
			"component": TheOwnedItems,
			"meta": {
				"indexed": true
			}
		}
	]
});

