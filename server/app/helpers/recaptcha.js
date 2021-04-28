"use strict";

const bent = require("bent");
const formurlencoded = require("form-urlencoded");
const raiseError = require("./errorHandler").raiseError;

module.exports = {
	async validateRecaptcha(recaptchaValue) {

		if (!process.env.RECAPTCHA_KEY || !recaptchaValue) {
			throw raiseError(
				400,
				"Missing required properties for validating User's Captcha."
			);
		}

		const post = bent(
			"https://www.google.com/",
			"POST",
			"json",
			200
		);

		let challengeResult = await post(
			"recaptcha/api/siteverify",
			formurlencoded({
				"secret": process.env.RECAPTCHA_KEY,
				"response": recaptchaValue
			}),
			{
				"Content-Type": "application/x-www-form-urlencoded"
			}
		);

		if (challengeResult.success) {
			return challengeResult;
		} else {
			throw raiseError(
				500,
				Array.isArray(challengeResult.errorCodes) ? challengeResult.errorCodes[0] : challengeResult.errorCodes || "Uknown recaptcha challenge error."
			);
		}
	}
}