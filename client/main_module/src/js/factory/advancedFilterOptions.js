"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/public/api`;

export default {

	async loadCategories() {
		return await http.get(
			`${API_ENDPOINT}/category?limit=100`
		);
	},

	async loadBrothers() {
		return await http.get(
			`${API_ENDPOINT}/brother?limit=100`
		);
	},

	async loadLocations() {
		return await http.get(
			`${API_ENDPOINT}/location?limit=100`
		);
	}

};