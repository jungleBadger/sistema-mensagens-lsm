"use strict";

import ordersFactory from "../../../factory/orders";

export default {

	async fetchProcessedOrders (context) {
		let result = await ordersFactory.fetchProcessedOrders();
		context.commit("orders", result);
		return result;
	}

};