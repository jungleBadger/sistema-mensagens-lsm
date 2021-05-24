import state from "./state.js";
import getters from "./getters.js";
import mutation from "./mutations.js";
import actions  from "./actions.js";

import admin from "./admin/module";
import regular from "./regular/module";

export default {
	"state": state,
	"getters": getters,
	"mutations": mutation,
	"actions": actions,
	"modules": {
		admin,
		regular
	},
	"namespaced": true
};
