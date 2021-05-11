"use strict";

export default {
	"isLoading": true,
	"totalAdminUsersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20
	},
	"adminUserItems": [],
	"tableColumns": [
		{
			"key": "id",
			"label": "ID",
			"size": "60px"
		},
		{
			"key": "email",
			"label": "Email",
			"size": "240px"
		},
		{
			"key": "displayName",
			"label": "Nome exibição",
			"size": "240px"
		},
		{
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedAdminUser": null
};