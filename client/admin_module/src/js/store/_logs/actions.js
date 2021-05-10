"use strict";

import logsFactory from "../../factory/logs";

export default {

	async retrieveTotalLogsCount(context) {
		let result = await logsFactory.retrieveTotalLogsCount();
		context.commit("totalLogsCount", result.count);
	},

	async retrieveLogs(context) {
		const {skip, limit} = context.getters["pagination"];
		let logs = await logsFactory.retrieveLogs(skip, limit);
		context.commit("logItems", logs.results);
	}

};