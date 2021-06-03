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
			"type": "date",
			"parser": "short"
		},
		{
			"originalId": "DATA_FIM",
			"key": "endDate",
			"label": "Data fim",
			"type": "date",
			"parser": "short"
		},
		{
			"originalId": "LOCALIDADE",
			"key": "location",
			"label": "Localidade"
		},
		{
			"originalId": "TOTAL_MENSAGENS",
			"key": "totalMessages",
			"label": "Mensagens",
			"size": "120px"
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