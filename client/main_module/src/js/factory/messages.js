"use strict";

import http from "../../../../_etc/js/http";

const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/public/api/message`;

export default {


	async retrieveMessagesByEventId (eventId, skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}/list/${eventId}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},


	async retrieveMessageById (id) {
		return await http.get(
			`${API_ENDPOINT}/${id}`
		);
	}

};