"use strict";

export default {
	"isLoading": true,
	"totalLocationsCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "PAIS",
		"orderDirection": "ASC"
	},
	"locationItems": [],
	"tableColumns": [
		{
			"originalId": "PAIS",
			"key": "country",
			"label": "País"
		},
		{
			"originalId": "ESTADO",
			"key": "state",
			"label": "Estado"
		},
		{
			"originalId": "CIDADE",
			"key": "city",
			"label": "Cidade"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedLocation": null
};