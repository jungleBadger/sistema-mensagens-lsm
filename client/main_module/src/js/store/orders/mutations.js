"use strict";

import OwnedItem from "./model/OwnedItem";
import OrderItem from "./model/OrderItem";

export default {
	isLoading (context, loadingState) {
		return context.isLoading = loadingState;
	},

	ownedItems (context, items) {
		return context.ownedItems = items.map(item => new OwnedItem(item));
	},

	totalOrdersCount(state, count) {
		state.totalOrdersCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "CRIADO_EM", "orderDirection": "DESC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	orderItems(state, orders = []) {
		state.orderItems = orders.map(order => new OrderItem(order));
	}
}