"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalCategoriesCount(state) {
		return state.totalCategoriesCount;
	},

	pagination(state) {
		return state.pagination
	},

	categoryItems(state) {
		return state.categoryItems;
	},

	selectedCategory(state) {
		return state.selectedCategory;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};