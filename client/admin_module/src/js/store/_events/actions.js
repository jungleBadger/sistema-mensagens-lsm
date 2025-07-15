"use strict";

import eventsFactory from "../../factory/events";
import Event from "./model/Event";

export default {

	async createEvent(context, event) {
		try {
			let createdEvent = await eventsFactory.createEvent(event);
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Evento criado com sucesso."
				},
				{"root": true}
			);

			context.commit("selectedEvent", {
				...event,
				...createdEvent
			});

			return createdEvent;
		} catch (e) {
			let error = {
				"title": "Houve um erro ao criar o Evento.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao criar o Evento.",
					"subtitle": `Evento ${event.title} já existe no sistema.`
				}
			}

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": error.title,
					"subtitle": error.subtitle
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}
	},

	async searchEvents(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await eventsFactory.searchEvents(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalEventsCount", result.totalCount);
			context.commit("eventItems", result.results);
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

	async retrieveEvents(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let events = await eventsFactory.retrieveEvents(skip, limit, orderBy, orderDirection);
			context.commit("eventItems", events.results);
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


	},


	async updateEvent(context, event) {
		try {
			await eventsFactory.updateEvent(event);
			let events = context.getters["eventItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Evento atualizado com sucesso."
				},
				{"root": true}
			);
			context.commit(
				"eventItems",
				events.map(item => {
					return item.id === event.id ? new Event({
						...item,
						...event
					}) : item;
				})
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro atualizando o Evento.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao atualizar o Evento.",
					"subtitle": `Evento ${event.title} já existe no sistema.`
				}
			}

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": error.title,
					"subtitle": error.subtitle
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}
	},

	async deleteEvent(context, eventId) {
		try {
			await eventsFactory.deleteEvent(eventId);
			let events = context.getters["eventItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Evento excluído com sucesso."
				},
				{"root": true}
			);
			context.commit("totalEventsCount", events.length - 1);
			context.commit("eventItems", events.filter(item => item.id !== eventId));
			return true;
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro excluindo o Evento.",
					"subtitle": e && e.message && e.message.indexOf("SQL0532N") > -1 ? "Evento possui mensagens e não pôde ser deletado." : "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}

	}

};