"use strict";

import Log from "./model/Log";

export default {
	totalLogsCount(state, count) {
		state.totalLogsCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit
		}
	},

	logItems(state, logs = []) {
		state.logItems = logs.map(log => new Log(log));
	}
}