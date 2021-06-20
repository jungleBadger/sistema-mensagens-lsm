"use strict";

export default {
	isLoading (context) {
		return context.isLoading;
	},

	ownedItems (context) {
		return context.ownedItems;
	},

	totalOrdersCount(state) {
		return state.totalOrdersCount;
	},

	pagination(state) {
		return state.pagination
	},

	orderItems(state) {
		return state.orderItems;
	},

	tableColumns(state) {
		return state.tableColumns;
	}

};