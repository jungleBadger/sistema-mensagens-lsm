"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalLogsCount(state) {
		return state.totalLogsCount;
	},

	pagination(state) {
		return state.pagination
	},

	logItems(state) {
		return state.logItems;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};