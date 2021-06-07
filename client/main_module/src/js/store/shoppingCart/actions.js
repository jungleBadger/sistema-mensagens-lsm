"use strict";


import shoppingCartFactory from "../../factory/shoppingCart";

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
			context.commit("currentCart", currentCart.filter(orderItem => orderItem.ID));
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
	}
};