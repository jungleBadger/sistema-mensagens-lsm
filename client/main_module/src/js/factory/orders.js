"use strict";

import http from "../../../../_etc/js/http";

const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/order`;

export default {
	async fetchPendingOrders() {
		return await http.get(`${API_ENDPOINT}/pending`);
	},

	async fetchProcessedOrders() {
		return await http.get(`${API_ENDPOINT}/processed`);
	},

	async fetchRejectedOrders() {
		return await http.get(`${API_ENDPOINT}/rejected`);
	},

	async setOrderToPending(orderId) {
		return await http.patch(`${API_ENDPOINT}/${orderId}/pending`);
	},

	async validateOrder(orderId) {
		return await http.patch(`${API_ENDPOINT}/${orderId}/validate`);
	},

	async ownedItems() {
		return await http.get(`${API_ENDPOINT}/self/owned`);
	},

	async searchOrders(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/self/search`);

		url.searchParams.append("filterText", filterText);
		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);

		// 🔧 Adiciona extraFilterColumns se fornecido
		if (filterColumn) {
			url.searchParams.append("extraFilterColumns", filterColumn);
		}

		return await http.get(url);
	},

	async retrieveOrders(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}/self?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalOrdersCount() {
		return await http.get(`${API_ENDPOINT}/self/count`);
	}
};
