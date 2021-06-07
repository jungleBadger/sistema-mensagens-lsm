"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

module.exports = class Location {

	model = {};

	constructor (
		country,
		state,
		city,
		description
	) {
		let schemaValidationResult = Joi.object(
			{
				"PAIS": Joi.string().max(128).required(),
				"ESTADO": Joi.string().max(128).required(),
				"CIDADE": Joi.string().max(128).required(),
				"DESCRICAO": Joi.string().max(1024).optional().allow(""),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"PAIS": country,
				"ESTADO": state,
				"CIDADE": city,
				"DESCRICAO": description || "",
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