(function () {
	"use strict";

	module.exports = {
		"setSelectedLanguage": function (context, language) {
			window.localStorage.setItem("language", language);
			document.querySelector("html").setAttribute("lang", language);
			context.commit("selectLanguage", language);
		}
	};

}());