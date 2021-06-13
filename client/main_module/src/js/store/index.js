"use strict";

import { createStore } from "vuex";
import notification from "./notification/module";
import events from "./events/module";
import orders from "./orders/module";
import shoppingCart from "./shoppingCart/module";
import utilities from "./utilities/module";
import i18n from "./i18n/module";

export default createStore({
	"modules": {
		notification,
		events,
		orders,
		shoppingCart,
		utilities,
		i18n
	},
	"strict": process.env.NODE_ENV !== "production"
});

