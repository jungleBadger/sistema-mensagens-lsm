"use strict";

export default {

	isLoading(state) {
		return state.isLoading;
	},

	totalMessagesCount(state) {
		return state.totalMessagesCount;
	},

	totalMessagesCountByEventId(state) {
		return state.totalMessagesCountByEventId;
	},

	pagination(state) {
		return state.pagination
	},

	messageItems(state) {
		return state.messageItems;
	},

	messageItemsByEventId(state) {
		return state.messageItemsByEventId;
	},

	selectedMessage(state) {
		return state.selectedMessage;
	},

	tableColumns(state) {
		return state.tableColumns;
	}
};