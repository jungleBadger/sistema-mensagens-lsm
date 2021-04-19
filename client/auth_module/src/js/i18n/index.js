"use strict";

import {createI18n} from "vue-i18n";

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";
const DEFAULT_FALLBACK = process.env.DEFAULT_FALLBACK || "en";
const enLang = require("./en-US");
const ptLang = require("./pt-BR");

export default createI18n({
	"locale": DEFAULT_LOCALE,
	"locales": ["en", "pt"],
	"fallbackLocale": DEFAULT_FALLBACK,
	"dateTimeFormats": {
		"en": enLang.dateTimeFormats,
		"pt": ptLang.dateTimeFormats
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