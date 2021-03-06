"use strict";

export default {

	userInfo(context, userInfo) {
		context.userInfo = userInfo;
	},

	isSideMenuOpen(context, value = false) {
		context.isSideMenuOpen = value;
	},

	isAdvancedFiltersModalOpen(context, value = false) {
		context.isAdvancedFiltersModalOpen = value;
	},

	acknowledgeLoginMessage(context) {
		context.acknowledgeLoginMessage = true;
	},

	acknowledgeRuleMessage(context) {
		context.acknowledgeRuleMessage = true;
	}
}