"use strict";

export default {
	"isLoading": true,
	"totalLogsCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "CRIADO_EM",
		"orderDirection": "DESC"
	},
	"logItems": [],
	"tableColumns": [
		{
			"originalId": "OPERADOR_FANTASIA",
			"key": "operator",
			"label": "Operador"
		},
		{
			"originalId": "ACAO",
			"key": "action",
			"label": "Ação",
			"size": "80px"
		},
		{
			"originalId": "REFERENCIA_TABELA",
			"key": "referenceTable",
			"label": "Entidade",
			"size": "80px"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	]
};