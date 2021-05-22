"use strict";

import regularUsersFactory from "../../../factory/users";

export default {

	async searchRegularUsers(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await regularUsersFactory.searchUsers(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalRegularUsersCount", result.totalCount);
			context.commit("regularUserItems", result.results);
		} catch (e) {
			console.log(e);
		}

	},

	async retrieveTotalRegularUsersCount(context) {
		let result = await regularUsersFactory.retrieveTotalUsersCount();
		context.commit("totalRegularUsersCount", result.count);
	},

	async retrieveRegularUsers(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		let regularUsers = await regularUsersFactory.retrieveUsers(skip, limit, orderBy, orderDirection);
		context.commit("regularUserItems", regularUsers.results);
	},

	async retrieveRegularUserById(context, regularUserId) {
		return await regularUsersFactory.retrieveUserById(regularUserId);
	},

	async updateRegularUser(context, regularUser) {
		try {
			await regularUsersFactory.updateUser(regularUser);
			let regularUsers = context.getters["regularUserItems"];
			if (regularUser.isAdmin) {
				context.commit("totalRegularUsersCount", regularUsers.length - 1);
				context.commit("regularUserItems", regularUsers.filter(item => item.id !== regularUser.id));
			} else {
				context.commit(
					"regularUserItems",
					regularUsers.map(item => {
						return item.id === regularUser.id ? {
							...item,
							...regularUser
						} : item;
					})
				);
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
					"title": `Houve um erro ao atualizar o usuário ${regularUser.id}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	}

};