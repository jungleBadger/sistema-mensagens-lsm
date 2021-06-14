"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalEventsCount(state) {
		return state.totalEventsCount;
	},

	pagination(state) {
		return state.pagination
	},

	eventItems(state) {
		return state.eventItems;
	},

	messagesByEvent(state) {
		return state.messagesByEvent;
	},

	selectedEvent(state) {
		return state.selectedEvent;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};