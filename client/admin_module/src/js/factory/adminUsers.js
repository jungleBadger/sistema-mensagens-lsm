"use strict";

import http from "../../../../_etc/js/http";

export default {

	async createAdminUser(user = {}) {
		return await http.post(
			"/api/admin/user/",
			user
		);
	},
	async retrieveAdminUsers(skip, limit) {
		return await http.get(
			`/api/admin/user?skip=${skip}&limit=${limit}&orderBy=ID&orderDirection=DESC`
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

	// async updateAdminUser(user = {}) {
	// 	return await http.patch(
	// 		`/api/admin/user/${user.id}`,
	// 		{
	// 			"displayName": user.displayName
	// 		}
	// 	);
	// },

	async deleteAdminUser(userId) {
		return await http.delete(
			`/api/admin/user/${userId}`
		);
	}
};