"use strict";

export default {
	"totalLogsCount": null,
	"pagination": {
		"skip": 0,
		"limit": 5
	},
	"logItems": [],
	"tableColumns": [
		{
			"key": "id",
			"label": "ID"
		},
		{
			"key": "operator",
			"label": "Quem?"
		},
		{
			"key": "action",
			"label": "O quê?"
		},
		{
			"key": "referenceTable",
			"label": "Onde?"
		},
		{
			"key": "createdAt",
			"label": "Quando?",
			"type": "date"
		}
	]
};