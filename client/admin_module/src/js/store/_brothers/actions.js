"use strict";

import brothersFactory from "../../factory/brothers";

export default {

	async createBrother(context, displayName) {
		try {
			await brothersFactory.createBrother({displayName});
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Irmão criado com sucesso."
				},
				{"root": true}
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro ao criar o Irmão.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao criar o Irmão.",
					"subtitle": `Irmão ${displayName} já existe no sistema.`
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

	async searchBrothers(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await brothersFactory.searchBrothers(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalBrothersCount", result.totalCount);
			context.commit("brotherItems", result.results);
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

	async retrieveTotalBrothersCount(context) {
		try {
			let result = await brothersFactory.retrieveTotalBrothersCount();
			context.commit("totalBrothersCount", result.count);
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

	async retrieveBrothers(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let brothers = await brothersFactory.retrieveBrothers(skip, limit, orderBy, orderDirection);
			context.commit("brotherItems", brothers.results);
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

	async retrieveBrotherById(context, brotherId) {

		try {
			return await brothersFactory.retrieveBrotherById(brotherId);

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar o Irmão ${brotherId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}


	},


	async updateBrother(context, brother) {
		try {
			await brothersFactory.updateBrother(brother);
			let brothers = context.getters["brotherItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Irmão atualizado com sucesso."
				},
				{"root": true}
			);
			context.commit(
				"brotherItems",
				brothers.map(item => {
					return item.id === brother.id ? {
						...item,
						...brother
					} : item;
				})
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro atualizando o Irmão.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao atualizar o Irmão.",
					"subtitle": `Irmão ${brother.displayName} já existe no sistema.`
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

	async deleteBrother(context, brotherId) {
		try {
			await brothersFactory.deleteBrother(brotherId);
			let brothers = context.getters["brotherItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Irmão excluído com sucesso."
				},
				{"root": true}
			);
			context.commit("totalBrothersCount", brothers.length - 1);
			context.commit("brotherItems", brothers.filter(item => item.id !== brotherId));
			return true;
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro excluindo o Irmão.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	}

};