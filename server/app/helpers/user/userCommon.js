"use strict";

const raiseError = require("../errorHandler").raiseError;
const { compareHash } = require("../security");
const crud = require("./adminUserCRUD");

module.exports = {

	/**
	 * Check admin User password.
	 * @method checkPassword
	 * @async
	 * @param {string} userEmail - Raw data to be hashed.
	 * @param {string} userPassword - Token to sign the secret, defaults to APP_SECRET env.
	 * @return {Promise<boolean|Error>} Containing the operation result.
	 */
	async checkPassword(
		userEmail,
		userPassword
	) {

		if (!userEmail || !userPassword) {
			throw raiseError(
				400,
				"Missing required properties for logging in."
			);
		} else if (userPassword.length < 8) {
			throw raiseError(
				400,
				"Invalid input - failing fast."
			);
		}

		let user = await crud.retrieveByEmail(
			userEmail,
			["SENHA", "ADMINISTRADOR"]
		);

		console.log(user);

		return true;





	}
}