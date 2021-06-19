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

	useAdvancedSearch(context, useAdvancedSearch) {
		context.useAdvancedSearch = useAdvancedSearch;
	},

	ownedOnly(context, ownedOnly) {
		context.ownedOnly = Boolean(ownedOnly);
	},

	eventTitle(context, eventTitle) {
		context.eventTitle = eventTitle;
	},

	messageTitle(context, messageTitle) {
		context.messageTitle = messageTitle;
	},

	startDate(context, startDate) {
		context.startDate = startDate;
	},

	endDate(context, endDate) {
		context.endDate = endDate;
	},

	selectedBrothers(context, brothers) {
		context.selectedBrothers = brothers;
	},
	selectedCategories(context, categories) {
		context.selectedCategories = categories;
	},
	selectedLocations(context, locations) {
		context.selectedLocations = locations;
	},

	removeFilters(context) {
		context.ownedOnly = false;
		context.eventTitle = "";
		context.messageTitle = "";
		context.startDate = "";
		context.endDate = "";
		context.selectedBrothers = [];
		context.selectedCategories = [];
		context.selectedLocations = [];
		context.useAdvancedSearch = false;
	}
}