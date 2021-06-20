"use strict";

import {createI18n} from "vue-i18n";

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "pt";
const DEFAULT_FALLBACK = process.env.DEFAULT_FALLBACK || "pt";
const enLang = require("./en-US");
const ptLang = require("./pt-BR");

console.log({
	"en": enLang.numberFormats,
	"pt": ptLang.numberFormats
});

export default createI18n({
	"locale": DEFAULT_LOCALE,
	"locales": ["en", "pt"],
	"fallbackLocale": DEFAULT_FALLBACK,
	"datetimeFormats": {
		"en": enLang.datetimeFormats,
		"pt": ptLang.datetimeFormats
	},
	"numberFormats": {
		"en": enLang.numberFormats,
		"pt": ptLang.numberFormats
	},
	"messages": {
		"en": enLang.messages,
		"pt": ptLang.messages
	}
})