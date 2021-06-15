"use strict";

export default {

	userInfo(context) {
		return context.userInfo;
	},

	isSideMenuOpen(context) {
		return context.isSideMenuOpen;
	},

	isAdvancedFiltersModalOpen(context) {
		return context.isAdvancedFiltersModalOpen;
	}
};