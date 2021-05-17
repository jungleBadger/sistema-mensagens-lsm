"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/category`;

export default {



	async createCategory(category = {}) {
		return await http.post(
			"/api/category/",
			{
				"name": category.name
			}
		);
	},

	async searchCategories(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "CRIADO_EM");
		} else {
			url.searchParams.append("filterColumn", filterColumn);
		}
		url.searchParams.append("filterText", filterText);
		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);


		return await http.get(
			url
		);
	},

	async retrieveCategories(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`/api/category?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
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