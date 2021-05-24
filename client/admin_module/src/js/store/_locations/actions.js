"use strict";

import locationsFactory from "../../factory/locations";

export default {

	async createLocation(context, payload) {
		try {
			await locationsFactory.createLocation(payload);
			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Localidade criada com sucesso."
				},
				{"root": true}
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro ao criar a Localidade.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao criar a Localidade.",
					"subtitle": "Localidade já existe no sistema."
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

	async searchLocations(context, params) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];
		try {
			let result = await locationsFactory.searchLocations(params.filterText, params.filterColumn, params.skip || skip, params.limit || limit, orderBy, orderDirection);
			context.commit("totalLocationsCount", result.totalCount);
			context.commit("locationItems", result.results);
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

	async retrieveTotalLocationsCount(context) {
		try {
			let result = await locationsFactory.retrieveTotalLocationsCount();
			context.commit("totalLocationsCount", result.count);
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

	async retrieveLocations(context, params = {}) {
		const {skip, limit, orderBy, orderDirection} = context.getters["pagination"];

		try {
			let locations = await locationsFactory.retrieveLocations(params.skip || skip, params.limit || limit, orderBy, orderDirection);
			context.commit("locationItems", locations.results);
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

	async retrieveLocationById(context, locationId) {

		try {
			return await locationsFactory.retrieveLocationById(locationId);

		} catch (e) {
			context.commit(
				"notification/addNotification",
				{
					"kind": "error",
					"title": `Houve um erro ao carregar a Localidade ${locationId}.`,
					"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
				},
				{"root": true}
			);
			console.log(e);
			return false;
		}


	},


	async updateLocation(context, location) {
		try {
			await locationsFactory.updateLocation(location);
			let locations = context.getters["locationItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Localidade atualizado com sucesso."
				},
				{"root": true}
			);
			context.commit(
				"locationItems",
				locations.map(item => {
					return item.id === location.id ? {
						...item,
						...location
					} : item;
				})
			);
			return true;
		} catch (e) {
			let error = {
				"title": "Houve um erro atualizando a Localidade.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error = {
					"title": "Houve um conflito ao atualizar a Localidade.",
					"subtitle": "Localidade já existe no sistema."
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

	async deleteLocation(context, locationId) {
		try {
			await locationsFactory.deleteLocation(locationId);
			let locations = context.getters["locationItems"];

			context.commit(
				"notification/addNotification",
				{
					"kind": "success",
					"title": "Sucesso!",
					"subtitle": "Localidade excluída com sucesso."
				},
				{"root": true}
			);
			context.commit("totalLocationsCount", locations.length - 1);
			context.commit("locationItems", locations.filter(item => item.id !== locationId));
			return true;
		} catch (e) {
			let error = {
				"kind": "error",
				"title": "Houve um erro ao excluir a Categoria.",
				"subtitle": "Confira os dados, tente novamente e se o erro persistir contate o suporte."
			}

			if (e.status === 409) {
				error.subtitle = "Esta Localidade é dependência de um Evento existente."
			}

			context.commit(
				"notification/addNotification",
				error,
				{"root": true}
			);
			console.log(e);
			return false;
		}

	}

};