"use strict";

export default {
	"isLoading": true,
	"totalMessagesCount": null,
	"totalMessagesCountByEventId": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "ORDEM",
		"orderDirection": "ASC"
	},
	"messageItems": [],
	"messageItemsByEventId": [],
	"tableColumns": [
		{
			"originalId": "ORDEM",
			"key": "order",
			"label": "Ordem",
			"size": "80px"
		},
		{
			"originalId": "TITULO",
			"key": "title",
			"label": "Título",
			"size": "240px"
		},
		{
			"originalId": "DATA_MINISTRADO",
			"key": "messageDate",
			"label": "Data",
			"type": "date",
			"parser": "short"
		},
		{
			"originalId": "IRMAO_NOME",
			"key": "brotherName",
			"label": "Irmão"
		},
		{
			"originalId": "CAMINHO_ARQUIVO_AUDIO",
			"key": "audioFilePath",
			"label": "Audio",
			"size": "80px",
			"type": "boolean"
		},
		{
			"originalId": "CAMINHO_ARQUIVO_ESBOCO",
			"key": "pdfFilePath",
			"label": "Esboço",
			"size": "80px",
			"type": "boolean"
		}
		// {
		// 	"originalId": "CRIADO_EM",
		// 	"key": "createdAt",
		// 	"label": "Criado em",
		// 	"type": "date"
		// }
	],
	"selectedMessage": null
};