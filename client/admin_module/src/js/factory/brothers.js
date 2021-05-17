"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/brother`;

export default {

	async createBrother(brother = {}) {
		return await http.post(
			"/api/brother/",
			{
				"displayName": brother.displayName
			}
		);
	},

	async searchBrothers(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "CRIADO_EM");
		} else {
			url.searchParams.append("filterColumn", filterColumn);
		}
		url.searchParams.append("filterText", filterText);
		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);


		return await http.get(
			url
		);
	},

	async retrieveBrothers(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`/api/brother?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalBrothersCount() {
		return await http.get(
			"/api/brother/count"
		);
	},

	async retrieveBrotherById(id) {
		return await http.get(
			`/api/brother/${id}`
		);
	},

	async updateBrother(brother = {}) {
		return await http.patch(
			`/api/brother/${brother.id}`,
			{
				"displayName": brother.displayName
			}
		);
	},

	async deleteBrother(brotherId) {
		return await http.delete(
			`/api/brother/${brotherId}`
		);
	}
};