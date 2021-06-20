"use strict";

import messagesFactory from "../../factory/messages";
import Message from "./model/Message";

export default {

	async createMessage (context, message) {
		try {
			let res = await messagesFactory.createMessage(message);
			if (res.status === 200 || res.status === 201) {
				context.commit(
					"notification/addNotification",
					{
						"kind": "success",
						"title": "Sucesso!",
						"subtitle": "Mensagem criada com sucesso."
					},
					{ "root": true }
				);
			} else {
				let error = {
					"title": "Houve um erro ao criar a Mensagem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				};

				if (res.status === 409) {
					error = {
						"title": "Houve um conflito ao criar a Mensagem.",
						"subtitle": `Mensagem ${message.title} já existe no sistema.`
					};
				} else if (res.status === 400) {
					error = {
						"title": "Houve um problema ao criar a Mensagem.",
						"subtitle": "Tipo de arquivo não aceito."
					};
				}

				context.commit(
					"notification/addNotification",
					{
						"kind": "error",
						"title": error.title,
						"subtitle": error.subtitle
					},
					{ "root": true }
				);
			}

			return true;
		} catch (e) {

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao criar a Mensagem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
			console.log(e);
			return false;
		}
	},

	async searchMessages (context, params) {
		const {
			skip,
			limit,
			orderBy,
			orderDirection
		} = context.getters["pagination"];
		try {
			let result = await messagesFactory.searchMessages(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalMessagesCount", result.totalCount);
			context.commit("messageItems", result.results);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro realizando a busca.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
		}

	},

	async retrieveTotalMessagesCount (context) {
		try {
			let result = await messagesFactory.retrieveTotalMessagesCount();
			context.commit("totalMessagesCount", result.count);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro calculando o total de items.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
		}

	},

	async retrieveTotalMessagesCountByEventId (context, eventId) {
		try {
			let result = await messagesFactory.retrieveTotalMessagesCountByEventId(eventId);
			context.commit("totalMessagesCountByEventId", result.count);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro calculando o total de items.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
		}

	},

	async retrieveMessages (context) {
		const {
			skip,
			limit,
			orderBy,
			orderDirection
		} = context.getters["pagination"];

		try {
			let messages = await messagesFactory.retrieveMessages(skip, limit, orderBy, orderDirection);
			context.commit("messageItems", messages.results);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro buscando dados.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
		}

	},

	async retrieveMessagesByEventId (context, eventId) {
		const {
			skip,
			limit,
			orderBy,
			orderDirection
		} = context.getters["pagination"];

		try {
			let messages = await messagesFactory.retrieveMessagesByEventId(eventId, skip, limit, orderBy, orderDirection);
			context.commit("messageItemsByEventId", messages.results);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro buscando dados.",
					"subtitle": "Confira os filtros, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
		}

	},

	async retrieveMessageById (context, messageId) {

		try {
			return await messagesFactory.retrieveMessageById(messageId);

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar a Mensagem ${messageId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
			console.log(e);
			return false;
		}

	},

	async updateMessage (context, message) {

		try {
			let res = await messagesFactory.updateMessage(message);
			let messages = context.getters["messageItemsByEventId"];

			if (res.status === 200 || res.status === 201) {
				context.commit(
					"notification/addNotification",
					{
						"kind": "success",
						"title": "Sucesso!",
						"subtitle": "Mensagem atualizada com sucesso."
					},
					{ "root": true }
				);
				let parsedResult = await res.json();

				context.commit(
					"messageItemsByEventId",
					messages.map(item => {
						return item.id === message.id ? new Message({
							...message,
							...parsedResult,
							"brotherName": message.brotherName
						}) : item;
					})
				);
			} else {
				let error = {
					"title": "Houve um erro ao atualizar a Mensagem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				};

				if (res.status === 400) {
					error = {
						"title": "Houve um problema ao atualizar a Mensagem.",
						"subtitle": "Tipo de arquivo não aceito."
					};
				}

				context.commit(
					"notification/addNotification",
					{
						"kind": "error",
						"title": error.title,
						"subtitle": error.subtitle
					},
					{ "root": true }
				);
			}

			return true;
		} catch (e) {

			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro ao criar a Mensagem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
			console.log(e);
			return false;
		}

	},

	async deleteMessage (context, messageId) {
		try {
			await messagesFactory.deleteMessage(messageId);
			let messages = context.getters["messageItemsByEventId"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Mensagem excluído com sucesso."
				},
				{ "root": true }
			);
			context.commit("totalMessagesCountByEventId", messages.length - 1);
			context.commit("messageItemsByEventId", messages.filter(item => item.id !== messageId));
			return true;
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro excluindo a Mensagem.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
			console.log(e);
			return false;
		}
	},

	async organizeMessages (context, params) {
		try {
			await messagesFactory.organizeMessages(params.eventId, params.messages);
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Mensagens ordenadas com sucesso."
				},
				{ "root": true }
			);
		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": "Houve um erro organizando as Mensagens.",
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{ "root": true }
			);
			console.log(e);
		}

	}

};