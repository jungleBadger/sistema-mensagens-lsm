"use strict";

export default {

	brothers(context) {
		return context.brothers;
	},
	categories(context) {
		return context.categories ;
	},
	locations(context) {
		return context.locations;
	},

	selectedBrothers(context) {
		return context.selectedBrothers;
	},
	selectedCategories(context) {
		return context.selectedCategories;
	},
	selectedLocations(context) {
		return context.selectedLocations;
	}
};