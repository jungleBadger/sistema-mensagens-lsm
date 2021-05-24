"use strict";

import Log from "./model/Log";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalLogsCount(state, count) {
		state.totalLogsCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "ID", "orderDirection": "DESC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	logItems(state, logs = []) {
		state.logItems = logs.map(log => new Log(log));
	}
}