"use strict";

import http from "../../../../_etc/js/http";

export default {

	async verifyCaptcha(recaptchaData) {
		return await http.post(
			"/api/recaptcha/",
			{ recaptchaData }
		);
	}
};

