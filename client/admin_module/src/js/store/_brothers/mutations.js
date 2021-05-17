"use strict";

import Brother from "./model/Brother";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalBrothersCount(state, count) {
		state.totalBrothersCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "NOME_EXIBICAO", "orderDirection": "ASC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	brotherItems(state, brothers = []) {
		state.brotherItems = brothers.map(brother => new Brother(brother));
	},

	selectedBrother(state, brother) {
		state.selectedBrother = new Brother(brother);
	},

	unsetSelectedBrother(state) {
		state.selectedBrother = null;
	}
}