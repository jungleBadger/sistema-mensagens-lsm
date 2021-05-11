"use strict";

import Category from "./model/Category";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalCategorysCount(state, count) {
		state.totalCategoriesCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit
		}
	},

	categoryItems(state, categories = []) {
		state.categoryItems = categories.map(category => new Category(category));
	},

	selectedCategory(state, category) {
		state.selectedCategory = new Category(category);
	},

	unsetSelectedCategory(state) {
		state.selectedCategory = null;
	}
}