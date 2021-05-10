"use strict";

const Joi = require("joi");
const raiseError = require("../helpers/errorHandler").raiseError;

module.exports = class Category {

	model = {};

	constructor (
		name
	) {
		let schemaValidationResult = Joi.object(
			{
				"NOME": Joi.string().max(64)
			}
		).validate(
			{
				"NOME": name
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