"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheAppHome from "../components/core/the-app-home.vue";
import TheBrothersMain from "../components/sections/brothers/the-brothers-main.vue";
import TheBrotherDetails from "../components/sections/brothers/the-brother-details.vue";
import TheBrotherDeleteConfirmation from "../components/sections/brothers/the-brother-delete-confirmation.vue";
import TheCategoriesMain from "../components/sections/categories/the-categories-main.vue";
import TheCategoryDetails from "../components/sections/categories/the-category-details.vue";
import TheCategoryDeleteConfirmation from "../components/sections/categories/the-category-delete-confirmation.vue";
import TheEventsMain from "../components/sections/events/the-events-main.vue";
import TheEventDetails from "../components/sections/events/the-event-details.vue";
import TheEventDeleteConfirmation from "../components/sections/events/the-event-delete-confirmation.vue";
import TheUsersMain from "../components/sections/users/the-users-main.vue";
import TheAdminUserDetails from "../components/sections/users/admin/the-admin-user-details.vue";
import TheRegularUserDetails from "../components/sections/users/regular/the-regular-user-details.vue";
import TheLocationsMain from "../components/sections/locations/the-locations-main.vue";
import TheLocationDetails from "../components/sections/locations/the-location-details.vue";
import TheLocationDeleteConfirmation from "../components/sections/locations/the-location-delete-confirmation.vue";
import TheLogsMain from "../components/sections/logs/the-logs-main.vue";

import TheMessageListOrdering from "../components/sections/events/messages/the-message-list-ordering";
import TheMessageDetails from "../components/sections/events/messages/the-message-details.vue";
import TheMessageDeleteConfirmation from "../components/sections/events/messages/the-message-delete-confirmation.vue";

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
				},
				{
					"name": "app.brothers.delete",
					"path": "delete/:brotherId",
					"component": TheBrotherDeleteConfirmation,
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
				},
				{
					"name": "app.categories.delete",
					"path": "delete/:categoryId",
					"component": TheCategoryDeleteConfirmation,
					"meta": {
					}
				}
			]
		},
		{
			"name": "app.locations",
			"path": "/localidades",
			"component": TheLocationsMain,
			"meta": {
				"indexed": true
			},
			"children": [
				{
					"name": "app.locations.details",
					"path": ":locationId",
					"component": TheLocationDetails,
					"meta": {
					}
				},
				{
					"name": "app.locations.delete",
					"path": "delete/:locationId",
					"component": TheLocationDeleteConfirmation,
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
			},
			"children": [
				{
					"name": "app.events.details",
					"path": ":eventId",
					"component": TheEventDetails,
					"meta": {
					},
					"children": [
						{
							"name": "app.events.organize",
							"path": "organizar",
							"component": TheMessageListOrdering,
							"meta": {
							}
						},
						{
							"name": "app.events.message.details",
							"path": "mensagem/:messageId",
							"component": TheMessageDetails,
							"meta": {
							}
						},
						{
							"name": "app.events.message.delete",
							"path": "mensagem/delete/:messageId",
							"component": TheMessageDeleteConfirmation,
							"meta": {
							}
						}
					]
				},
				{
					"name": "app.events.delete",
					"path": "delete/:eventId",
					"component": TheEventDeleteConfirmation,
					"meta": {
					}
				}
			]
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
					"path": "admin/:userId",
					"component": TheAdminUserDetails,
					"meta": {
					}
				},
				{
					"name": "app.users.regular.details",
					"path": "regular/:userId",
					"component": TheRegularUserDetails,
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

