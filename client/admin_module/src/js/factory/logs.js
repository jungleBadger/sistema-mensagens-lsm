"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/logs`;

export default {

	async searchLogs(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);


		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "REFERENCIA_TABELA,ACAO,CRIADO_EM");
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

	async retrieveLogs(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`/api/logs?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalLogsCount() {
		return await http.get(
			"/api/logs/count"
		);
	}
};