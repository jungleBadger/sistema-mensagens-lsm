"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;
const db2Timestamp = require("../helpers/db2Timestamp");

module.exports = class User {

	constructor (
		email,
		hashedPassword,
		displayName = "",
		passwordRegistered = true
	) {
		let schemaValidationResult = Joi.object(
			{
				"ID": Joi.number().optional(),
				"EMAIL": Joi.string().email().required(),
				"SENHA": Joi.string().min(8).max(128).required(),
				"NOME_EXIBICAO": Joi.string().allow( "").allow(null).default(null).optional(),
				"ADMINISTRADOR": Joi.boolean().invalid(true),
				"SENHA_REGISTRADA": Joi.boolean(),
				"EMAIL_CONFIRMADO": Joi.boolean().invalid(true),
				"ATUALIZADO_EM": Joi.string().required()
			}
		).validate(
			{
				"EMAIL": email,
				"SENHA": hashedPassword,
				"NOME_EXIBICAO": displayName,
				"ADMINISTRADOR": false,
				"SENHA_REGISTRADA": passwordRegistered,
				"EMAIL_CONFIRMADO": false,
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