"use strict";

import adminUsersFactory from "../../../factory/adminUsers";

export default {

	async createAdminUser(context, displayName) {
		return await adminUsersFactory.createAdminUser({displayName});
	},

	async searchAdminUsers(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let result = await adminUsersFactory.searchAdminUsers(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalAdminUsersCount", result.totalCount);
			context.commit("adminUserItems", result.results);
		} catch (e) {
			console.log(e);
		}

	},


	async retrieveTotalAdminUsersCount(context) {
		try {
			let result = await adminUsersFactory.retrieveTotalAdminUsersCount();
			context.commit("totalAdminUsersCount", result.count);
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

	async retrieveAdminUsers(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {

			let adminUsers = await adminUsersFactory.retrieveAdminUsers(skip, limit, orderBy, orderDirection);
			context.commit("adminUserItems", adminUsers.results);
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

	async retrieveAdminUserById(context, adminUserId) {
		try {
			return await adminUsersFactory.retrieveAdminUserById(adminUserId);

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar o Usuário ${adminUserId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	},

	async updateAdminUser(context, adminUser) {
		try {
			await adminUsersFactory.updateAdminUser(adminUser);
			let adminUsers = context.getters["adminUserItems"];
			if (adminUser.isAdmin) {
				context.commit(
					"adminUserItems",
					adminUsers.map(item => {
						return item.id === adminUser.id ? {
							...item,
							...adminUser,
							"updatedAt": new Date()
						} : item;
					})
				);
			} else {
				context.commit("totalAdminUsersCount", adminUsers.length - 1);
				context.commit("adminUserItems", adminUsers.filter(item => item.id !== adminUser.id));
			}

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Usuário atualizado com sucesso."
				},
				{"root": true}
			);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao atualizar o usuário ${adminUser.id}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	},

	async deleteAdminUser(context, adminUserId) {
		return await adminUsersFactory.deleteAdminUser(adminUserId);
	}

};