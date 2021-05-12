"use strict";

import RegularUser from "./model/RegularUser";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalAdminUsersCount(state, count) {
		state.totalAdminUsersCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit
		}
	},

	adminUserItems(state, adminUsers = []) {
		console.log(adminUsers);
		state.adminUserItems = adminUsers.map(adminUser => new RegularUser(adminUser));
	},

	selectedAdminUser(state, adminUser) {
		state.selectedAdminUser = new RegularUser(adminUser);
	},

	unsetSelectedAdminUser(state) {
		state.selectedAdminUser = null;
	}
}