"use strict";

import advancedFilterOptions from "../../factory/advancedFilterOptions";

export default {

	async loadBrothers(context) {
		let brothers = await advancedFilterOptions.loadBrothers();

		context.commit("brothers", brothers.results);

		return brothers;
	},

	async loadCategories(context) {
		let categories = await advancedFilterOptions.loadCategories();

		context.commit("categories", categories.results);

		return categories;
	},

	async loadLocations(context) {
		let locations = await advancedFilterOptions.loadLocations();

		context.commit("locations", locations.results);

		return locations;
	}
};