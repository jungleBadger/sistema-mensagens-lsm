"use strict";

export default {
	orders(context, pendingOrders) {
		context.orders = pendingOrders.map(order => order);
	}
}