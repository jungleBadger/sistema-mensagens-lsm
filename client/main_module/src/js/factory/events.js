"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/public/api/event`;

export default {

	async searchEvents(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "EVENTO.CRIADO_EM,EVENTO.DESCRICAO,M.DATA_MINISTRADO,EVENTO.DATA_INICIO,EVENTO.DATA_FIM,M.TITULO");
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


	async advancedSearchEvents(skip, limit, orderBy, orderDirection, advancedFilters = {}) {
		let url = new URL(`${API_ENDPOINT}/advanced-search`);

		url.searchParams.append("extraFilterColumns", "EVENTO.CRIADO_EM,EVENTO.DESCRICAO,M.DATA_MINISTRADO,EVENTO.DATA_INICIO,EVENTO.DATA_FIM,M.TITULO");

		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);


		return await http.post(
			url,
			advancedFilters
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
	}

};