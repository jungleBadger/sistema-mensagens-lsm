"use strict";

import logsFactory from "../../factory/logs";

export default {

	async searchLogs(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let result = await logsFactory.searchLogs(params.filterText, params.filterColumn, skip, limit, orderBy, orderDirection);
			context.commit("totalLogsCount", result.totalCount);
			context.commit("logItems", result.results);
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

	async retrieveTotalLogsCount(context) {
		try {
			let result = await logsFactory.retrieveTotalLogsCount();
			context.commit("totalLogsCount", result.count);
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

	async retrieveLogs(context) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let logs = await logsFactory.retrieveLogs(skip, limit, orderBy, orderDirection);
			context.commit("logItems", logs.results);
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

	}

};