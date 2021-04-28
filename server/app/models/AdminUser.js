"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;

module.exports = class AdminUser {

	model = {};

	constructor (
		email,
		hashedPassword,
		displayName = ""
	) {
		let schemaValidationResult = Joi.object(
			{
				"ID": Joi.number().optional(),
				"EMAIL": Joi.string().email().required(),
				"SENHA": Joi.string().min(8).max(128).required(),
				"NOME_EXIBICAO": Joi.string().allow( "").allow(null).default(null).optional(),
				"ADMINISTRADOR": Joi.boolean().invalid(false),
				"SENHA_REGISTRADA": Joi.boolean().invalid(true),
				"EMAIL_CONFIRMADO": Joi.boolean().invalid(false)
			}
		).validate(
			{
				"EMAIL": email,
				"SENHA": hashedPassword,
				"NOME_EXIBICAO": displayName,
				"ADMINISTRADOR": true,
				"SENHA_REGISTRADA": false,
				"EMAIL_CONFIRMADO": true
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