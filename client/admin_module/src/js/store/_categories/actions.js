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


	async searchCategories(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let result = await categoriesFactory.searchCategories(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalCategoriesCount", result.totalCount);
			context.commit("categoryItems", result.results);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro realizando a busca.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}


	},


	async retrieveTotalCategoriesCount(context) {
		try {
			let result = await categoriesFactory.retrieveTotalCategoriesCount();
			context.commit("totalCategoriesCount", result.count);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro calculando o total de items.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async retrieveCategories(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let categories = await categoriesFactory.retrieveCategories(skip, limit, orderBy, orderDirection);
			context.commit("categoryItems", categories.results);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro buscando dados.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

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
			let categories = context.getters["categoryItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Categoria atualizada com sucesso."
				},
				{"root": true}
			);
			context.commit(
				"categoryItems",
				categories.map(item => {
					return item.id === categories.id ? {
						...item,
						...categories
					} : item;
				})
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
			let categories = context.getters["categoryItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Categoria excluída com sucesso."
				},
				{"root": true}
			);
			context.commit("totalCategoriesCount", categories.length - 1);
			context.commit("categoryItems", categories.filter(item => item.id !== categoryId));
			return true;
		} catch (e) {
			let error = {
				"kind": "error",
				"title": "Houve um erro ao excluir a Categoria.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error.subtitle = "Esta Categoria é dependência de um Evento existente."
			}

			context.commit(
				"notification/addNotification",
				error,
				{"root": true}
			);
			console.log(e);
			return false;
		}


	}

};