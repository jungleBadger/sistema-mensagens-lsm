"use strict";


import ordersFactory from "../../factory/orders";

export default {

	async retrieveOwnedItems (context) {
		let items = await ordersFactory.ownedItems();
		context.commit("ownedItems", items);
	}
};