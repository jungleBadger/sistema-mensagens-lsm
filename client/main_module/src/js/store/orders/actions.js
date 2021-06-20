"use strict";


import ordersFactory from "../../factory/orders";
// import ordersFactory from "../../../../../admin_module/src/js/factory/orders";

export default {

	async retrieveOwnedItems (context) {
		let items = await ordersFactory.ownedItems();

		context.commit("ownedItems", items);
	},

	async searchOrders(context, params) {

		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await ordersFactory.searchOrders(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalOrdersCount", result.totalCount);
			context.commit("orderItems", result.results);
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

	async retrieveTotalOrdersCount(context) {
		try {
			let result = await ordersFactory.retrieveTotalOrdersCount();
			console.log(result);
			context.commit("totalOrdersCount", result.count);
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

	async retrieveOrders(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let orders = await ordersFactory.retrieveOrders(skip, limit, orderBy, orderDirection);
			context.commit("orderItems", orders.results);
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

	}
};