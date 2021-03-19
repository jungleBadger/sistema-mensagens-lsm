(function () {
	"use strict";

	const mutations = require("../constants/mutation-types.js");

	module.exports = require("Vuex").mapMutations("i18n", Object.keys(mutations).map(mutation => mutations[mutation]));

}());