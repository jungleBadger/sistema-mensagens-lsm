"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalAdminUsersCount(state) {
		return state.totalAdminUsersCount;
	},

	pagination(state) {
		return state.pagination
	},

	adminUserItems(state) {
		return state.adminUserItems;
	},

	selectedAdminUser(state) {
		return state.selectedAdminUser;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};