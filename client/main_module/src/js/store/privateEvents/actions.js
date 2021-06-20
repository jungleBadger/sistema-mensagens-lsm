"use strict";

import eventsFactory from "../../factory/privateEvents";

export default {

	async searchEvents(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await eventsFactory.searchEvents(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalEventsCount", result.totalCount);

			if (params.isPagination) {
				context.commit("eventItems", result.results);
			} else {
				context.commit("replaceEventItems", result.results);
			}

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro realizando a busca.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async advancedSearchEvents(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		console.log(params);
		try {
			let result = await eventsFactory.advancedSearchEvents(
				skip,
				limit,
				orderBy,
				orderDirection,
				params.advancedFilters

			);
			context.commit("totalEventsCount", result.totalCount);

			if (params.isPagination) {
				context.commit("eventItems", result.results);
			} else {
				context.commit("replaceEventItems", result.results);
			}

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro realizando a busca.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async retrieveTotalEventsCount(context) {
		try {
			let result = await eventsFactory.retrieveTotalEventsCount();
			context.commit("totalEventsCount", result.count);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro calculando o total de items.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async retrieveEvents(context, params = {}) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let events = await eventsFactory.retrieveEvents(skip, limit, orderBy, orderDirection);
			if (params.isPagination) {
				context.commit("eventItems", events.results);
			} else {
				context.commit("replaceEventItems", events.results);
			}

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro buscando dados.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
		}

	},

	async retrieveEventById(context, eventId) {

		try {
			return await eventsFactory.retrieveEventById(eventId);

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar o Evento ${eventId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	}
};