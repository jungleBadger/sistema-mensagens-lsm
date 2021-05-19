"use strict";

import Event from "./model/Event";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalEventsCount(state, count) {
		state.totalEventsCount = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "ID", "orderDirection": "ASC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	eventItems(state, events = []) {
		state.eventItems = events.map(event => new Event(event));
	},

	selectedEvent(state, event) {
		state.selectedEvent = new Event(event);
	},

	unsetSelectedEvent(state) {
		state.selectedEvent = null;
	}
}