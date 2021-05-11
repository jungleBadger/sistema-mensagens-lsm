"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheAppHome from "../components/core/the-app-home.vue";
import TheBrothersMain from "../components/sections/brothers/the-brothers-main.vue";
import TheBrotherDetails from "../components/sections/brothers/the-brother-details.vue";
import TheCategoriesMain from "../components/sections/categories/the-categories-main.vue";
import TheCategoryDetails from "../components/sections/categories/the-category-details.vue";
import TheEventsMain from "../components/sections/events/the-events-main.vue";
import TheUsersMain from "../components/sections/users/the-users-main.vue";
import TheAdminUserDetails from "../components/sections/users/admin/the-admin-user-details.vue";
import TheLogsMain from "../components/sections/logs/the-logs-main.vue";

export default createRouter({
	"base": "/admin",
	"history": createWebHistory("/admin/"),
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
			"name": "app.brothers",
			"path": "/irmaos",
			"component": TheBrothersMain,
			"meta": {
				"indexed": true
			},
			"children": [
				{
					"name": "app.brothers.details",
					"path": ":brotherId",
					"component": TheBrotherDetails,
					"meta": {
					}
				}
			]
		},
		{
			"name": "app.categories",
			"path": "/categorias",
			"component": TheCategoriesMain,
			"meta": {
				"indexed": true
			},
			"children": [
				{
					"name": "app.categories.details",
					"path": ":categoryId",
					"component": TheCategoryDetails,
					"meta": {
					}
				}
			]
		},
		{
			"name": "app.events",
			"path": "/eventos",
			"component": TheEventsMain,
			"meta": {
				"indexed": true
			}
		},
		{
			"name": "app.users",
			"path": "/usuarios",
			"component": TheUsersMain,
			"meta": {
				"indexed": true
			},
			"children": [
				{
					"name": "app.users.admin.details",
					"path": ":adminUserId",
					"component": TheAdminUserDetails,
					"meta": {
					}
				}
			]
		},
		{
			"name": "app.logs",
			"path": "/logs",
			"component": TheLogsMain,
			"meta": {
				"indexed": true
			}
		}
	]
})

