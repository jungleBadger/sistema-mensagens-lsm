"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;

module.exports = class User {

	constructor (
		action,
		referenceId,
		referenceTable,
		operatorAlias,
		operatorId
	) {
		let schemaValidationResult = Joi.object(
			{
				"REFERENCIA_ID": Joi.number().required(),
				"REFERENCIA_TABELA": Joi.string().max(128).required(),
				"ACAO": Joi.alternatives().try("CREATE", "EDIT", "DELETE"),
				"OPERADOR_FANTASIA": Joi.boolean(),
				"OPERADOR_ID": Joi.boolean()
			}
		).validate(
			{
				"REFERENCIA_ID": referenceId,
				"REFERENCIA_TABELA": referenceTable,
				"ACAO": action,
				"OPERADOR_FANTASIA": operatorAlias,
				"OPERADOR_ID": operatorId
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