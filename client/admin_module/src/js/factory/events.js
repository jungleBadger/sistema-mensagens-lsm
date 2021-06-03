"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/event`;

export default {

	async createEvent(event = {}) {
		return await http.post(
			`${API_ENDPOINT}/`,
			event
		);
	},

	async searchEvents(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "EVENTO.CRIADO_EM,EVENTO.DATA_INICIO,EVENTO.DATA_FIM,M.TITULO");
		} else {
			url.searchParams.append("filterColumn", filterColumn);
		}
		url.searchParams.append("filterText", filterText);
		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);


		return await http.get(
			url
		);
	},

	async retrieveEvents(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalEventsCount() {
		return await http.get(
			`${API_ENDPOINT}/count`
		);
	},

	async retrieveEventById(id) {
		return await http.get(
			`${API_ENDPOINT}/${id}`
		);
	},

	async updateEvent(event = {}) {
		return await http.patch(
			`${API_ENDPOINT}/${event.id}`,
			event
		);
	},

	async deleteEvent(eventId) {
		return await http.delete(
			`${API_ENDPOINT}/${eventId}`
		);
	}
};