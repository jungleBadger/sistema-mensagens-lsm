"use strict";

import {createStore} from "vuex";
import i18n from "./i18n/module";

export default createStore({
	"modules": {
		i18n
	},
	"strict": process.env.NODE_ENV !== "production"
});