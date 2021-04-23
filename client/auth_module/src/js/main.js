"use strict";

import { createApp } from "vue";

import MainComponent from "./components/app.vue";
import routerHandler from "./router/index.js";
import storeHandler from "./store/index.js";
import i18nHandler from "./i18n/index.js";
import FontAwesomeIcon from "../../../_etc/js/fontawesome-import";

// window.validateCallback = async function () {
// 	try {
// 		let result = await grecaptcha.getResponse();
// 		let verify = await verifyCaptcha(result);
// 		document.getElementById("recaptcha-button").style.display = "none";
// 		document.getElementById("main-buttons").style.display = "flex";
// 		methods.attachListeners();
// 	} catch (e) {
// 		console.log(e)
// 	}
// }
//

export default createApp(
	MainComponent
).use(
	routerHandler
).use(
	storeHandler
).use(
	i18nHandler
).component(
	"FontAwesomeIcon", FontAwesomeIcon
).mount("#lsm-app");
