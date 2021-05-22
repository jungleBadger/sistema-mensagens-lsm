"use strict";

export default {
	"isLoading": true,
	"totalRegularUsersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "ATUALIZADO_EM",
		"orderDirection": "DESC"
	},
	"regularUserItems": [],
	"tableColumns": [
		{
			"originalId": "EMAIL",
			"key": "email",
			"label": "Email",
			"size": "240px"
		},
		{
			"originalId": "NOME_EXIBICAO",
			"key": "displayName",
			"label": "Nome exibição",
			"size": "240px"
		},
		{
			"originalId": "ATUALIZADO_EM",
			"key": "updatedAt",
			"label": "Atualizado em",
			"type": "date"
		}
	],
	"selectedRegularUser": null
};