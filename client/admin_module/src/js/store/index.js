"use strict";

import {createStore} from "vuex";
import i18n from "./i18n/module";
import utilities from "./utilities/module";
import notification from "./notification/module";
import brothers from "./_brothers/module";
import categories from "./_categories/module";
import events from "./_events/module";
import logs from "./_logs/module";
import users from "./_users/module";


export default createStore({
	"modules": {
		i18n,
		utilities,
		notification,
		brothers,
		categories,
		events,
		logs,
		users
	},
	"strict": process.env.NODE_ENV !== "production"
});