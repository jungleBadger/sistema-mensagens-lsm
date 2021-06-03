"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

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
				"NOME_EXIBICAO": Joi.string().max(512).allow( "").allow(null).default(null).optional(),
				"ADMINISTRADOR": Joi.boolean().invalid(false),
				"SENHA_REGISTRADA": Joi.boolean().invalid(true),
				"EMAIL_CONFIRMADO": Joi.boolean().invalid(false),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"EMAIL": email,
				"SENHA": hashedPassword,
				"NOME_EXIBICAO": displayName,
				"ADMINISTRADOR": true,
				"SENHA_REGISTRADA": false,
				"EMAIL_CONFIRMADO": true,
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