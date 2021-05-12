"use strict";

import categoriesFactory from "../../factory/categories";

export default {

	async createCategory(context, name) {
		return await categoriesFactory.createCategory({name});
	},

	async retrieveTotalCategoriesCount(context) {
		let result = await categoriesFactory.retrieveTotalCategoriesCount();
		context.commit("totalCategoriesCount", result.count);
	},

	async retrieveCategories(context) {
		const {skip, limit} = context.getters["pagination"];
		let categories = await categoriesFactory.retrieveCategories(skip, limit);
		context.commit("categoryItems", categories.results);
	},

	async retrieveCategoryById(context, categoryId) {
		return await categoriesFactory.retrieveCategoryById(categoryId);
	},


	async updateCategory(context, category) {
		return await categoriesFactory.updateCategory(category);
	},

	async deleteCategory(context, categoryId) {
		return await categoriesFactory.deleteCategory(categoryId);
	}

};