"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/auth`;

export default {

	async userInfo() {
		return await http.get(
			`${API_ENDPOINT}/me`
		);
	}

};