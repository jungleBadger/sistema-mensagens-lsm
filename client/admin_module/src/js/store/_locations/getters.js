"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalLocationsCount(state) {
		return state.totalLocationsCount;
	},

	pagination(state) {
		return state.pagination
	},

	locationItems(state) {
		return state.locationItems;
	},

	selectedLocation(state) {
		return state.selectedLocation;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};