"use strict";

import http from "../../../../_etc/js/http";

export default {

	async createCategory(category = {}) {
		return await http.post(
			"/api/category/",
			{
				"name": category.name
			}
		);
	},
	async retrieveCategories(skip, limit) {
		return await http.get(
			`/api/category?skip=${skip}&limit=${limit}&orderBy=NOME&orderDirection=ASC`
		);
	},

	async retrieveTotalCategoriesCount() {
		return await http.get(
			"/api/category/count"
		);
	},

	async retrieveCategoryById(id) {
		return await http.get(
			`/api/category/${id}`
		);
	},

	async updateCategory(category = {}) {
		return await http.patch(
			`/api/category/${category.id}`,
			{
				"name": category.name
			}
		);
	},

	async deleteCategory(categoryId) {
		return await http.delete(
			`/api/category/${categoryId}`
		);
	}
};