"use strict";


import ordersFactory from "../../../factory/orders";

export default {

	async fetchRejectedOrders (context) {
		let result = await ordersFactory.fetchRejectedOrders();
		context.commit("orders", result);
		return result;
	}

};