"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/self/cart`;

export default {

	async createCart() {
		return await http.post(
			`${API_ENDPOINT}/`
		);
	},

	async addItemToCart(itemId) {
		return await http.put(
			`${API_ENDPOINT}/add`,
			{
				"itemId": itemId
			}
		);
	},

	async removeItemFromCart(cartItemId) {
		return await http.delete(
			`${API_ENDPOINT}/remove/${cartItemId}`
		);
	},

	async retrieveCartItems() {
		return await http.get(
			`${API_ENDPOINT}/`
		);
	},

	async clearCart() {
		return await http.post(
			`${API_ENDPOINT}/clear`
		);
	}

};