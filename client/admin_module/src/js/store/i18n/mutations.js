(function () {
	"use strict";

	const mutations = require("./constants/mutation-types.js");

	module.exports = {
		[mutations.SET_LANGUAGES]: function (context, params = {}) {
			context.languages = params.availableLanguages;
			context.selectedLanguage = params.selectedLanguage;
		},
		[mutations.SELECT_LANGUAGE]: function (context, language) {
			context.selectedLanguage = language;
		},
		[mutations.SET_CURRENT_DATETIME]: function (context) {
			context.currentDateTime = new Date();
		}

	}

}());