"use strict";

import OrderItem from "./model/OrderItem";

export default {
	ownedItems (context, items) {
		return context.ownedItems = items.map(item => new OrderItem(item));
	}
}