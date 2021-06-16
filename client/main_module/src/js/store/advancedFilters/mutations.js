"use strict";

export default {

	brothers(context, brothers) {
		context.brothers = brothers;
	},
	categories(context, categories) {
		context.categories = categories;
	},
	locations(context, locations) {
		context.locations = locations;
	},

	selectedBrothers(context, brothers) {
		context.selectedBrothers = brothers;
	},
	selectedCategories(context, categories) {
		context.selectedCategories = categories;
	},
	selectedLocations(context, locations) {
		context.selectedLocations = locations;
	}
}