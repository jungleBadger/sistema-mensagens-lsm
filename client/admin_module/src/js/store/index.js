"use strict";

import {createStore} from "vuex";
import i18n from "./i18n/module";
import utilities from "./utilities/module";

export default createStore({
	"modules": {
		i18n,
		utilities
	},
	"strict": process.env.NODE_ENV !== "production"
});