"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/regular/user`;

export default {

	async createUser(user = {}) {
		return await http.post(
			API_ENDPOINT,
			user
		);
	},

	async searchUsers(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
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


	async retrieveUsers(skip, limit,  orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalUsersCount() {
		return await http.get(
			`${API_ENDPOINT}/count`
		);
	},

	async retrieveUserById(id) {
		return await http.get(
			`${API_ENDPOINT}/id/${id}`
		);
	},

	async updateUser(user = {}) {
		return await http.patch(
			`/api/common/user/${user.id}`,
			{
				"displayName": user.displayName,
				"isAdmin": user.isAdmin
			}
		);
	},

	async deleteUser(userId) {
		return await http.delete(
			`${API_ENDPOINT}/${userId}`
		);
	}
};