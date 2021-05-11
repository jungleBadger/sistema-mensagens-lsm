"use strict";

import http from "../../../../_etc/js/http";

export default {

	async retrieveLogs(skip, limit) {
		return await http.get(
			`/api/logs?skip=${skip}&limit=${limit}`
		);
	},

	async retrieveTotalLogsCount() {
		return await http.get(
			"/api/logs/count"
		);
	}
};