"use strict";

export default {
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