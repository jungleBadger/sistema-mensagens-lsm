"use strict";

import http from "../../../../_etc/js/http";

export default {

	async createBrother(brother = {}) {
		return await http.post(
			"/api/brother/",
			{
				"displayName": brother.displayName
			}
		);
	},
	async retrieveBrothers(skip, limit) {
		return await http.get(
			`/api/brother?skip=${skip}&limit=${limit}&orderBy=NOME_EXIBICAO&orderDirection=ASC`
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