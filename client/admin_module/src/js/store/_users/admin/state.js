"use strict";

export default {
	"isLoading": true,
	"totalAdminUsersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "CRIADO_EM",
		"orderDirection": "DESC"
	},
	"adminUserItems": [],
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
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedAdminUser": null
};