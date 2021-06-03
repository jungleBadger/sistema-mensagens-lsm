"use strict";

import Message from "./model/Message";

export default {

	isLoading(state, loadingState) {
		state.isLoading = loadingState;
	},

	totalMessagesCount(state, count) {
		state.totalMessagesCount = Number(count);
	},

	totalMessagesCountByEventId(state, count) {
		state.totalMessagesCountByEventId = Number(count);
	},

	pagination(state, pagination = {"skip": 0, "limit": 5, "orderBy": "ID", "orderDirection": "ASC"}) {
		state.pagination = {
			"skip": pagination.skip,
			"limit": pagination.limit,
			"orderBy": pagination.orderBy,
			"orderDirection": pagination.orderDirection
		}
	},

	messageItems(state, messages = []) {
		state.messageItems = messages.map(message => new Message(message));
	},


	messageItemsByEventId(state, messages = []) {
		state.messageItemsByEventId = messages.map(message => new Message(message));
	},

	selectedMessage(state, message) {
		state.selectedMessage = new Message(message);
	},

	unsetSelectedMessage(state) {
		state.selectedMessage = null;
	}
}