"use strict";

import { createRouter, createWebHistory } from "vue-router";
import AppHome from "../components/core/app-home.vue"

export default createRouter({
	"base": "/admin",
	"history": createWebHistory("/admin/"),
	"routes": [
		{
			"name": "app.home",
			"path": "",
			"component": AppHome,
			"meta": {
				"indexed": true,
				"home": true
			}
		}
	]
})

