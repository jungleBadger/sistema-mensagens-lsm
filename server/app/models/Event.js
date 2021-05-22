"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

module.exports = class Event {

	model = {};

	constructor (
		title,
		startDate,
		endDate,
		categoryId,
		locationId
	) {
		let schemaValidationResult = Joi.object(
			{
				"TITULO": Joi.string().max(128).required(),
				"DATA_INICIO": Joi.string().required(),
				"DATA_FIM": Joi.string().required(),
				"CATEGORIA_ID": Joi.number().required(),
				"LOCALIDADE_ID": Joi.number().required(),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"TITULO": title,
				"DATA_INICIO": db2Timestamp(startDate),
				"DATA_FIM": db2Timestamp(endDate),
				"CATEGORIA_ID": categoryId,
				"LOCALIDADE_ID": locationId,
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