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

	selectedEvent(state) {
		return state.selectedEvent;
	},

	tableColumns(state) {
		return state.tableColumns;
	},

	selectedAudioPath(state) {
		return state.selectedAudioPath;
	}
};