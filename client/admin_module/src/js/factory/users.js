"use strict";

import http from "../../../../_etc/js/http";

export default {

	async createUser(user = {}) {
		return await http.post(
			"/api/user/",
			user
		);
	},
	async retrieveUsers(skip, limit) {
		return await http.get(
			`/api/user?skip=${skip}&limit=${limit}&orderBy=ID&orderDirection=DESC`
		);
	},

	async retrieveTotalUsersCount() {
		return await http.get(
			"/api/user/count"
		);
	},

	async retrieveUserById(id) {
		return await http.get(
			`/api/user/${id}`
		);
	},

	// async updateUser(user = {}) {
	// 	return await http.patch(
	// 		`/api/user/${user.id}`,
	// 		{
	// 			"displayName": user.displayName
	// 		}
	// 	);
	// },

	async deleteUser(userId) {
		return await http.delete(
			`/api/user/${userId}`
		);
	}
};