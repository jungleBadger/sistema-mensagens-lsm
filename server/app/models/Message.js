"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

module.exports = class Message {

	model = {};

	constructor (
		order,
		title,
		brotherId,
		eventId,
		messageDate,
		messageValue,
		audioFilePath,
		pdfFilePath,
		isEnabled
	) {
		let schemaValidationResult = Joi.object(
			{
				"ORDEM": Joi.number().required(),
				"TITULO": Joi.string().max(512).required(),
				"IRMAO_ID": Joi.number().required(),
				"EVENTO_ID": Joi.number().required(),
				"DATA_MINISTRADO": Joi.string().required(),
				"VALOR": Joi.number().required(),
				"CAMINHO_ARQUIVO_AUDIO": Joi.string().required(),
				"CAMINHO_ARQUIVO_ESBOCO": Joi.string().allow("").optional(),
				"HABILITADO": Joi.boolean().required(),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"ORDEM": Number(order),
				"TITULO": title,
				"IRMAO_ID": Number(brotherId),
				"EVENTO_ID": Number(eventId),
				"DATA_MINISTRADO": db2Timestamp(messageDate),
				"VALOR": Number(messageValue),
				"CAMINHO_ARQUIVO_AUDIO": audioFilePath,
				"CAMINHO_ARQUIVO_ESBOCO": pdfFilePath || "",
				"HABILITADO": typeof isEnabled === "string" ? isEnabled === "true" : Boolean(isEnabled),
				"ATUALIZADO_EM": db2Timestamp()
			}
		);


		if (schemaValidationResult.error) {
			throw raiseError(
				400,
				schemaValidationResult.error.message
			);
		} else {
			this.model = schemaValidationResult.value;
		}

	}

	getKeys() {
		return Object.keys(this.model || {});
	}

	getValues() {
		return Object.values(this.model || {});
	}
}