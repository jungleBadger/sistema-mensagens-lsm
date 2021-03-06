"use strict";


import shoppingCartFactory from "../../factory/shoppingCart";
import ordersFactory from "../../factory/orders";

export default {

	async createCart(context) {
		try {
			await shoppingCartFactory.createCart();
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao estabelecer o carrinho de compras.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}
	},

	async addItemToCart(context, itemId) {
		try {
			let newItem = await shoppingCartFactory.addItemToCart(itemId);
			context.commit("addItemToCurrentCart", newItem);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao tentar adicionar o item no carrinho.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}
	},

	async removeItemFromCart(context, cartItemId) {
		try {
			await shoppingCartFactory.removeItemFromCart(cartItemId);
			context.commit("removeItemFromCurrentCart", cartItemId);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao tentar remover o item do carrinho.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async retrieveCartItems(context) {
		try {
			let currentCart = await shoppingCartFactory.retrieveCartItems();
			console.log(currentCart);
			context.commit("currentCart", currentCart.filter(orderItem => orderItem.PEDIDO_ITEM_ID));
			return true;
		} catch (e) {
			if (e) {
				console.log(e);
				if (e.status === 404) {
					return false;
				} else {
					context.commit(
						"notification/addNotification",
						{
							"kind": "error",
							"title": "Houve um erro ao carregar o carrinho de compras.",
							"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
						},
						{"root": true}
					);
				}
			}

		}

	},


	async clearCart(context) {
		try {
			await shoppingCartFactory.clearCart();
			context.commit("currentCart", []);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao tentar limpar o carrinho.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}
	},


	async validateOrder(context, orderId) {
		try {
			let currentCart = await ordersFactory.validateOrder(orderId);
			context.commit("currentCart", currentCart.filter(orderItem => orderItem.PEDIDO_ITEM_ID));
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao tentar validar a ordem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}
	},


	async setOrderToPending(context, orderId) {
		try {
			await ordersFactory.setOrderToPending(orderId);
		} catch (e) {
			console.log(e);
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao tentar finalizar compra.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}
	}
};