"use strict";

import categoriesFactory from "../../factory/categories";

export default {

	async createCategory(context, name) {
		try {
			await categoriesFactory.createCategory({name});
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Categoria criado com sucesso."
				},
				{"root": true}
			);
			return true;
		} catch (e) {

			let error = {
				"title": "Houve um erro ao criar a Categoria.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao criar a Categoria.",
					"subtitle": `Categoria ${name} já existe no sistema.`
				}
			}

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": error.title,
					"subtitle": error.subtitle
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}


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
		try {
			return await categoriesFactory.retrieveCategoryById(categoryId);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar a Categoria ${categoryId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	},


	async updateCategory(context, category) {

		try {
			await categoriesFactory.updateCategory(category);
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Categoria atualizada com sucesso."
				},
				{"root": true}
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro ao atualizar a Categoria.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao atualizar a Categoria.",
					"subtitle": `Categoria ${category.name} já existe no sistema.`
				}
			}

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": error.title,
					"subtitle": error.subtitle
				},
				{"root": true}
			);
			console.log(e);
			return false;


		}
	},

	async deleteCategory(context, categoryId) {
		try {
			await categoriesFactory.deleteCategory(categoryId);
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Categoria excluída com sucesso."
				},
				{"root": true}
			);
			return true;
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao excluir a Categoria.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}


	}

};