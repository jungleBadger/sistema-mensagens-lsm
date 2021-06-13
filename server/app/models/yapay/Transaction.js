"use strict";

const Joi = require("joi");
const raiseError = require("../../helpers/errorHandler").raiseError;
const db2Timestamp = require("../../helpers/db2Timestamp");

module.exports = class Transaction {

	model = {};

	constructor (
		orderId,
		transactionId,
		transactionToken,
		transactionDate
	) {
		let schemaValidationResult = Joi.object(
			{
				"ID": Joi.number().optional(),
				"PEDIDO_ID": Joi.number().required(),
				"TRANSACAO_ID": Joi.number().required(),
				"TRANSACAO_TOKEN": Joi.string().max(64).required(),
				"DATA_TRANSACAO": Joi.string().required()
			}
		).validate(
			{
				"PEDIDO_ID": orderId,
				"TRANSACAO_ID": transactionId,
				"TRANSACAO_TOKEN": transactionToken,
				"DATA_TRANSACAO": db2Timestamp(transactionDate)
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