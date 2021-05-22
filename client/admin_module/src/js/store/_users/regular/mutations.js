"use strict";

import RegularUser from "./model/RegularUser";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalRegularUsersCount(state, count) {
		state.totalRegularUsersCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "ATUALIZADO_EM", "orderDirection": "DESC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	regularUserItems(state, regularUsers = []) {
		console.log(regularUsers);
		state.regularUserItems = regularUsers.map(regularUser => new RegularUser(regularUser));
	},

	selectedRegularUser(state, regularUser) {
		state.selectedRegularUser = new RegularUser(regularUser);
	},

	unsetSelectedRegularUser(state) {
		state.selectedRegularUser = null;
	}
}