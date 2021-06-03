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
				"REFERENCIA_ID": Joi.alternatives([Joi.string(), Joi.number()]).required(),
				"REFERENCIA_TABELA": Joi.string().max(64).required(),
				"ACAO": Joi.alternatives().try("CREATE", "UPDATE", "DELETE"),
				"OPERADOR_FANTASIA": Joi.string().required(),
				"OPERADOR_ID": Joi.number().integer().allow(null)
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