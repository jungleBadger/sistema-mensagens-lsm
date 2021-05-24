"use strict";

export default {
	"isLoading": true,
	"totalCategoriesCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "NOME",
		"orderDirection": "ASC"
	},
	"categoryItems": [],
	"tableColumns": [
		{
			"originalId": "NOME",
			"key": "name",
			"label": "Nome",
			"size": "240px"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedCategory": null
};