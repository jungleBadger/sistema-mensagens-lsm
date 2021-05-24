"use strict";

import Location from "./model/Location";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalLocationsCount(state, count) {
		state.totalLocationsCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "PAIS", "orderDirection": "ASC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	locationItems(state, locations = []) {
		state.locationItems = locations.map(location => new Location(location));
	},

	selectedLocation(state, location) {
		state.selectedLocation = new Location(location);
	},

	unsetSelectedLocation(state) {
		state.selectedLocation = null;
	}
}