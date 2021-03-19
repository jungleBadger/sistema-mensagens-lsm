"use strict";

import {createRouter, createWebHistory} from "vue-router";
import AppHome from "../components/core/app-home.vue"
import { faHome, faAllergies } from "@fortawesome/free-solid-svg-icons";

export default createRouter({
	"base": "/app",
	"history": createWebHistory("/app/"),
	"routes": [
		{
			"name": "app.home",
			"path": "",
			"component": AppHome,
			"meta": {
				"indexed": true,
				"home": true,
				"icon": faHome
			}
		},
		{
			"name": "details",
			"path": "/details",
			"component": AppHome,
			"meta": {
				"indexed": true,
				"icon": faAllergies
			},
			"children": [
				{
					"name": "Xxx",
					"path": "/test",
					"component": AppHome,

					"meta": {
						"indexed": true
					}
				}
			]
		}
	]
})

