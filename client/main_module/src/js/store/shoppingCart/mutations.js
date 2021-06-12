"use strict";

import OrderItem from "./model/OrderItem";

export default {
	currentCart(context, currentCart) {
		context.currentCart = currentCart.map(orderItem => new OrderItem(orderItem));
	},

	addItemToCurrentCart(context, orderItem) {
		context.currentCart.push(new OrderItem(orderItem));
	},

	removeItemFromCurrentCart(context, itemId) {
		context.currentCart = context.currentCart.filter(orderItem => orderItem.orderItemId !== itemId);
	}
}