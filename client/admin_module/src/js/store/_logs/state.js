"use strict";

export default {
	"isLoading": true,
	"totalLogsCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20
	},
	"logItems": [],
	"tableColumns": [
		{
			"key": "id",
			"label": "ID",
			"size": "60px"
		},
		{
			"key": "operator",
			"label": "Quem?"
		},
		{
			"key": "action",
			"label": "O quê?",
			"size": "80px"
		},
		{
			"key": "referenceTable",
			"label": "Onde?",
			"size": "80px"
		},
		{
			"key": "createdAt",
			"label": "Quando?",
			"type": "date"
		}
	]
};