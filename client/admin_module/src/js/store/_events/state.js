"use strict";

export default {
	"isLoading": true,
	"totalEventsCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "CRIADO_EM",
		"orderDirection": "DESC"
	},
	"eventItems": [],
	"tableColumns": [
		{
			"originalId": "TITULO",
			"key": "title",
			"label": "Título"
		},
		{
			"originalId": "DATA_INICIO",
			"key": "startDate",
			"label": "Data inicio",
			"type": "date"
		},
		{
			"originalId": "DATA_FIM",
			"key": "endDate",
			"label": "Data fim",
			"type": "date"
		},
		{
			"originalId": "LOCALIDADE",
			"key": "location",
			"label": "Localidade"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		}
	],
	"selectedEvent": null
};