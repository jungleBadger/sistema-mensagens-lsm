"use strict";

import {createStore} from "vuex";
import auth from "./auth/module";
import i18n from "./i18n/module";

export default createStore({
	"modules": {
		auth,
		i18n
	},
	"strict": process.env.NODE_ENV !== "production"
});