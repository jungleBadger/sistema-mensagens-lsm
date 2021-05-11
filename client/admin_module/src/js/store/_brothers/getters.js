"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalBrothersCount(state) {
		return state.totalBrothersCount;
	},

	pagination(state) {
		return state.pagination
	},

	brotherItems(state) {
		return state.brotherItems;
	},

	selectedBrother(state) {
		return state.selectedBrother;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};