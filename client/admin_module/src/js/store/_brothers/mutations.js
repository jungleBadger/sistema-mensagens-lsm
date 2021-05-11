"use strict";

import Brother from "./model/Brother";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalBrothersCount(state, count) {
		state.totalBrothersCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit
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