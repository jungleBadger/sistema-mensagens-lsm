"use strict";

export default {
	"isLoading": true,
	"totalCategoriesCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20
	},
	"categoryItems": [],
	"tableColumns": [
		{
			"key": "id",
			"label": "ID",
			"size": "60px"
		},
		{
			"key": "name",
			"label": "Nome",
			"size": "240px"
		},
		{
			"key": "createdAt",
			"label": "Criada em",
			"type": "date"
		}
	],
	"selectedCategory": null
};