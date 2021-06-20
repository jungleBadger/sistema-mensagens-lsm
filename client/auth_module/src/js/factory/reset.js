"use strict";

import http from "../../../../_etc/js/http";

export default {

	async requestPasswordReset(email) {
		return await http.post(
			"/api/common/user/request-reset",
			{
				email
			}
		);
	},

	async completeReset(email, apiKey, password) {
		return await http.patch(
			"/api/common/user/reset/complete",
			{
				email,
				apiKey,
				password
			}
		);
	}
};