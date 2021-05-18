"use strict";

import http from "../../../../_etc/js/http";
const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/location`;

export default {

	async createLocation(location = {}) {
		return await http.post(
			`${API_ENDPOINT}/`,
			{
				"country": location.country,
				"state": location.state,
				"city": location.city,
				"description": location.description
			}
		);
	},

	async searchLocations(filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "ESTADO,CIDADE,CRIADO_EM");
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

	async retrieveLocations(skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalLocationsCount() {
		return await http.get(
			`${API_ENDPOINT}/count`
		);
	},

	async retrieveLocationById(id) {
		return await http.get(
			`${API_ENDPOINT}/${id}`
		);
	},

	async updateLocation(location = {}) {
		return await http.patch(
			`${API_ENDPOINT}/${location.id}`,
			location
		);
	},

	async deleteLocation(locationId) {
		return await http.delete(
			`${API_ENDPOINT}/${locationId}`
		);
	}
};