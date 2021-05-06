"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;

module.exports = class AdminUser {

	model = {};

	constructor (
		displayName
	) {
		let schemaValidationResult = Joi.object(
			{
				"NOME_EXIBICAO": Joi.string().max(256)
			}
		).validate(
			{
				"NOME_EXIBICAO": displayName
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