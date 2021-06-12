"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/order`;

export default {

	async setOrderToPending(orderId) {
		return await http.patch(
			`${API_ENDPOINT}/${orderId}/pending`
		);
	}

};