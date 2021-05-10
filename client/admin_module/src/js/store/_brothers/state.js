"use strict";

export default {
	"isLoading": true,
	"totalBrothersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20
	},
	"brotherItems": [],
	"tableColumns": [
		{
			"key": "id",
			"label": "ID",
			"size": "60px"
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
	"selectedBrother": null
};