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

	useAdvancedSearch(context) {
		return context.useAdvancedSearch;
	},

	advancedFilters(context) {
		return {
			"ownedOnly": context.ownedOnly,
			"eventTitle": context.eventTitle,
			"messageTitle": context.messageTitle,
			"startDate": new Date(context.startDate),
			"endDate": new Date(context.endDate),
			"selectedBrothers": context.selectedBrothers.map(brother => brother.ID),
			"selectedCategories": context.selectedCategories.map(category => category.ID),
			"selectedLocations": context.selectedLocations.map(location => location.ID)
		}
	},

	eventTitle(context) {
		return context.eventTitle;
	},


	ownedOnly(context) {
		return context.ownedOnly;
	},

	messageTitle(context) {
		return context.messageTitle;
	},


	startDate(context) {
		return context.startDate;
	},


	endDate(context) {
		return context.endDate;
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