"use strict";

import {createStore} from "vuex";
import i18n from "./i18n/module";
import utilities from "./utilities/module";
import brothers from "./_brothers/module";
import categories from "./_categories/module";
import events from "./_events/module";
import logs from "./_logs/module";
import adminUsers from "./_adminUsers/module";


export default createStore({
	"modules": {
		i18n,
		utilities,
		brothers,
		categories,
		events,
		logs,
		adminUsers
	},
	"strict": process.env.NODE_ENV !== "production"
});