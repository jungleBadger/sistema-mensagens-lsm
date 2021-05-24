"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalRegularUsersCount(state) {
		return state.totalRegularUsersCount;
	},

	pagination(state) {
		return state.pagination
	},

	regularUserItems(state) {
		return state.regularUserItems;
	},

	selectedRegularUser(state) {
		return state.selectedRegularUser;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};