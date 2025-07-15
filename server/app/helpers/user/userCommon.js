"use strict";

const raiseError = require("../errorHandler").raiseError;
const { compareHash, generateJWT } = require("../security");
const crud = require("./userCRUD");

const mailerTransport = require("../mailer");
const resetPasswordEmailObject = require("../../templates/email/passwordReset");
const resetPasswordCompleteEmailObject = require("../../templates/email/passwordResetComplete");
const nodemailer = require("nodemailer")

module.exports = {

	/**
	 * Check admin User password.
	 * @method checkPassword
	 * @async
	 * @param {string} userEmail - Raw data to be hashed.
	 * @param {string} userPassword - Token to sign the secret, defaults to APP_SECRET env.
	 * @param {string} [hashedPassword] - Optional already converted password to avoid a database trip.
	 * @return {Promise<boolean|Error>} Containing the operation result.
	 */
	async checkPassword(
		userEmail,
		userPassword,
		hashedPassword
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

		const user = hashedPassword ? {
			"SENHA": hashedPassword
		} : await crud.retrieveByEmail(
			userEmail,
			["SENHA"]
		);

		return await compareHash(
			userPassword,
			user.SENHA
		);
	},

	async requestPasswordReset(userEmail) {
		await crud.retrieveByEmail(
			userEmail,
			["ID"]
		);
		let mailResult = await mailerTransport.sendMail({
			"to": userEmail,
			"subject": resetPasswordEmailObject.subject,
			"text": resetPasswordEmailObject.text,
			"html": resetPasswordEmailObject.html(
				"https://mensbrasil.restauradosabiblia.com.br/api/common/user/request-reset",
				await generateJWT(
					{ userEmail },
					process.env.APP_SECRET,
					{
						"expiresIn": "02 hours",
						"audience": "single_user"
					}
				)
			)
		});

		//@TODO Remove this log statement later - demo purposes only.
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailResult));
	},

	async updateUser(id, displayName, isAdmin, operator) {
		return crud.updateProfile(id, displayName, isAdmin, operator);
	},

	async updatePassword(email, newPassword) {
		let userId = await crud.retrieveByEmail(email);

		await crud.updatePassword(userId.ID, newPassword);
		let mailResult = await mailerTransport.sendMail({
			"to": email,
			"subject": resetPasswordCompleteEmailObject.subject,
			"text": resetPasswordCompleteEmailObject.text,
			"html": resetPasswordCompleteEmailObject.html()
		});

		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailResult));
		return true;
	}
}