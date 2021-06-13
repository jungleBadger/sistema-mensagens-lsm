"use strict";


import ordersFactory from "../../../factory/orders";

export default {

	async fetchPendingOrdersOrders (context) {
		let result = await ordersFactory.fetchPendingOrders();
		context.commit("orders", result);
		return result;
	}

};