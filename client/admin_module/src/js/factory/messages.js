"use strict";

import http from "../../../../_etc/js/http";

const API_ENDPOINT = `${window.location.protocol || "https:"}//${window.location.host || "localhost"}/api/message`;

export default {

	async createMessage (message = {}) {
		let formData = new FormData();

		formData.append("order", message.order);
		formData.append("title", message.title);
		formData.append("brotherId", message.brotherId);
		formData.append("messageDate", message.messageDate);
		formData.append("messageValue", message.messageValue);
		formData.append("isEnabled", message.isEnabled);
		formData.append("eventId", message.eventId);
		if (message.audioFile) {
			formData.append(
				"message_audio",
				message.audioFile,
				`audio.${message.audioFile.name.substring(message.audioFile.name.lastIndexOf(".") + 1, message.audioFile.name.length) || message.audioFile.name}`
			);
		}

		if (message.pdfFile) {
			formData.append("message_pdf", message.pdfFile, "esboco.pdf");
		}

		return await fetch(
			`${API_ENDPOINT}/?eventId=${message.eventId}`,
			{
				"method": "POST",
				"body": formData
			}
		);

	},

	async searchMessages (filterText, filterColumn, skip, limit, orderBy, orderDirection) {
		let url = new URL(`${API_ENDPOINT}/search`);

		if (!filterColumn || filterColumn === "all") {
			url.searchParams.append("extraFilterColumns", "CRIADO_EM");
		} else {
			url.searchParams.append("filterColumn", filterColumn);
		}
		url.searchParams.append("filterText", filterText);
		url.searchParams.append("skip", skip);
		url.searchParams.append("limit", limit);
		url.searchParams.append("orderBy", orderBy);
		url.searchParams.append("orderDirection", orderDirection);

		return await http.get(
			url
		);
	},

	async retrieveMessages (skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveMessagesByEventId (eventId, skip, limit, orderBy, orderDirection) {
		return await http.get(
			`${API_ENDPOINT}/list/${eventId}?skip=${skip}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`
		);
	},

	async retrieveTotalMessagesCount () {
		return await http.get(
			`${API_ENDPOINT}/count`
		);
	},

	async retrieveTotalMessagesCountByEventId (eventId) {
		return await http.get(
			`${API_ENDPOINT}/count/${eventId}`
		);
	},

	async retrieveMessageById (id) {
		return await http.get(
			`${API_ENDPOINT}/${id}`
		);
	},

	async updateMessage (message = {}) {
		let formData = new FormData();

		formData.append("order", message.order);
		formData.append("title", message.title);
		formData.append("brotherId", message.brotherId);
		formData.append("messageDate", message.messageDate);
		formData.append("messageValue", message.messageValue);
		formData.append("eventId", message.eventId);
		formData.append("isEnabled", message.isEnabled);
		if (message.audioFilePath) {
			formData.append("audioFilePath", message.audioFilePath);
		} else if (message.audioFile) {
			formData.append(
				"message_audio",
				message.audioFile,
				`audio.${message.audioFile.name.substring(message.audioFile.name.lastIndexOf(".") + 1, message.audioFile.name.length) || message.audioFile.name}`
			);
		}

		if (message.pdfFilePath) {
			formData.append("pdfFilePath", message.pdfFilePath);
		} else if (message.pdfFile) {
			formData.append("message_pdf", message.pdfFile, "esboco.pdf");
		}

		return await fetch(
			`${API_ENDPOINT}/${message.id}?eventId=${message.eventId}`,
			{
				"method": "PATCH",
				"body": formData
			}
		);
	},

	async organizeMessages (eventId, messages) {
		return await http.patch(
			`${API_ENDPOINT}/organize/${eventId}`,
			{ messages }
		);
	},

	async deleteMessage (messageId) {
		return await http.delete(
			`${API_ENDPOINT}/${messageId}`
		);
	}
};