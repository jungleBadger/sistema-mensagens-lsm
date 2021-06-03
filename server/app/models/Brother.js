"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

module.exports = class Brother {

	model = {};

	constructor (
		displayName
	) {
		let schemaValidationResult = Joi.object(
			{
				"NOME_EXIBICAO": Joi.string().max(512),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"NOME_EXIBICAO": displayName,
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