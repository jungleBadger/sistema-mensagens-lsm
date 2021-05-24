"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/admin/user`;

export default {

	async createAdminUser(user = {}) {
		return await http.post(
			"/api/admin/user/",
			user
		);
	},

	async searchAdminUsers(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "NOME_EXIBICAO,CRIADO_EM");
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

	async retrieveAdminUsers(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`/api/admin/user?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalAdminUsersCount() {
		return await http.get(
			"/api/admin/user/count"
		);
	},

	async retrieveAdminUserById(id) {
		return await http.get(
			`/api/admin/user/${id}`
		);
	},

	async updateAdminUser(user = {}) {
		return await http.patch(
			`/api/common/user/${user.id}`,
			{
				"displayName": user.displayName,
				"isAdmin": user.isAdmin
			}
		);
	},

	async deleteAdminUser(userId) {
		return await http.delete(
			`/api/admin/user/${userId}`
		);
	}
};