"use strict";

export default {
	"languages": function (context) {
		return context.languages;
	},
	"selectedLanguage": function (context) {
		return context.selectedLanguage;
	},
	"currentDateTime": function (context) {
		return context.currentDateTime;
	},
	"dayRange": function (context) {
		let actualHours = context.currentDateTime.getHours();
		if (actualHours >= 18 && actualHours <= 24) {
			return "night";
		} else if (actualHours < 18 && actualHours >= 13) {
			return "afternoon";
		} else {
			return "morning";
		}
	}
};