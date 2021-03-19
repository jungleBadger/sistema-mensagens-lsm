"use strict";

import {createApp} from "vue";

import MainComponent from "./components/app.vue";
import routerHandler from "./router/index.js";
import storeHandler from "./store/index.js";
import i18nHandler from "./i18n/index.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default createApp(
	MainComponent
).use(
	routerHandler
).use(
	storeHandler
).use(
	i18nHandler
).component("FontAwesomeIcon", FontAwesomeIcon).mount("#slm-app");
