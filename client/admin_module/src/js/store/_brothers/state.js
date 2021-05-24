"use strict";

export default {
	"isLoading": true,
	"totalBrothersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "NOME_EXIBICAO",
		"orderDirection": "ASC"
	},
	"brotherItems": [],
	"tableColumns": [
		{
			"originalId": "NOME_EXIBICAO",
			"key": "displayName",
			"label": "Nome exibição",
			"size": "240px"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedBrother": null
};