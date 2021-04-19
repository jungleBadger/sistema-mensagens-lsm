"use strict";

import http from "../../../../_etc/js/http";

export default {

	async doLogin(email, password) {
		return await http.post(
			"/auth/login",
			{
				email,
				password
			}
		);
	}
};