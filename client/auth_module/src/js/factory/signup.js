"use strict";

import http from "../../../../_etc/js/http";

export default {

	async doSignup(email, password) {
		return await http.post(
			"/api/regular/user/",
			{
				email,
				password
			}
		);
	}
};