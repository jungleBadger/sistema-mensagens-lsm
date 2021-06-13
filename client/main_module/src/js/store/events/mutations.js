"use strict";

import Event from "./model/Event";
import Message from "./model/Message";

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
		state.eventItems = state.eventItems.concat(events.map(event => new Event(event)));
	},

	replaceEventItems(state, events = []) {
		state.eventItems = events.map(event => new Event(event));
	},

	appendMessagesToEvent(state, params) {
		let event = state.eventItems.find(event => event.id === params.eventId);
		if (event) {
			event.messages = params.messages.map(message => new Message(message));
		}
	},

	selectedEvent(state, event) {
		state.selectedEvent = new Event(event);
	},

	unsetSelectedEvent(state) {
		state.selectedEvent = null;
	}
}