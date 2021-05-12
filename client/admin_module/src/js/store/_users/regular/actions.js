"use strict";

import adminUsersFactory from "../../../factory/adminUsers";

export default {

	async createAdminUser(context, displayName) {
		return await adminUsersFactory.createAdminUser({displayName});
	},

	async retrieveTotalAdminUsersCount(context) {
		let result = await adminUsersFactory.retrieveTotalAdminUsersCount();
		context.commit("totalAdminUsersCount", result.count);
	},

	async retrieveAdminUsers(context) {
		const {skip, limit} = context.getters["pagination"];
		let adminUsers = await adminUsersFactory.retrieveAdminUsers(skip, limit);
		context.commit("adminUserItems", adminUsers.results);
	},

	async retrieveAdminUserById(context, adminUserId) {
		return await adminUsersFactory.retrieveAdminUserById(adminUserId);
	},


	async updateAdminUser(context, adminUser) {
		return await adminUsersFactory.updateAdminUser(adminUser);
	},

	async deleteAdminUser(context, adminUserId) {
		return await adminUsersFactory.deleteAdminUser(adminUserId);
	}

};