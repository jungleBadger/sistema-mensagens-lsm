import state from "./state.js";
import getters from "./getters.js";
import mutation from "./mutations.js";
import actions  from "./actions.js";

export default {
	"state": state,
	"getters": getters,
	"mutations": mutation,
	"actions": actions,
	"namespaced": true
};