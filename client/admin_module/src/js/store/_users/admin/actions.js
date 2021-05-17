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
		return await adminUsersFactory.updateAdminUser(adminUser);
	},

	async deleteAdminUser(context, adminUserId) {
		return await adminUsersFactory.deleteAdminUser(adminUserId);
	}

};