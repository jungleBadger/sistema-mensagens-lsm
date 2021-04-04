"use strict";
/**
 * Security helper
 * @module security
 * */
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");
const raiseError = require("./errorHandler").raiseError;
const child = require("child_process");
const path = require("path");
const CHILD_PROCESSES_PATH = "./app/helpers/child_processes/";


module.exports = {

	/**
	 * Generates a JWT applying app configs
	 * @method generateJWT
	 * @async
	 * @param {object} rawData - Raw data to be hashed.
	 * @param {string} [secret] - Token to sign the secret, defaults to APP_SECRET env.
	 * @param {object} [options] - Token options. {@see https://tools.ietf.org/html/rfc7519#section-4.1}
	 * @return {Promise<string | Error>} Containing the hashed token.
	 */
	generateJWT(rawData = {}, secret = "", options= {}) {
		return new Promise((resolve, reject) => {
			jwt.sign(
				rawData,
				secret || process.env.APP_SECRET,
				options,
				function (err, token) {
					return err ? reject(err) : resolve(token);
				}
			);
		});
	},

	/**
	 * Validates an app generated JWT
	 * @method validateJWT
	 * @async
	 * @param {string} token - Hashed string to be checked.
	 * @param {string} [secret] - Token to sign the secret, defaults to APP_SECRET env.
	 * @param {object} [options={}] - Token options. {@see https://tools.ietf.org/html/rfc7519#section-4.1}
	 * @throws Will throw a `400 - bad request` if required params are missing.
	 * @throws Will throw a `401 - unauthorized` if the token validation fails.
	 * @throws Will throw a `422 - unprocessable entity` if the token string is malformed.
	 * @return {Promise<Object | Error>} Containing the result of comparison
	 */
	validateJWT(token, secret = "", options = {}) {
		return new Promise((resolve, reject) => {
			if (!token || (!secret && !process.env.APP_SECRET)) {
				return reject(
					raiseError(
						400,
						"Invalid params."
					)
				);
			}
			jwt.verify(
				token,
				secret || process.env.APP_SECRET,
				options,
				(err, decoded) => {
					if (!err) {
						resolve(decoded);
					} else if (err === "invalid algorithm" || err === "jwt malformed") {
						reject(
							raiseError(
								422,
								"Error parsing token."
							)
						);
					} else {
						reject(
							raiseError(
								401,
								"Unauthorized call."
							)
						);
					}
				}
			);
		});
	},


	/**
	 * Apply cipher algorithm using the AES algorithm.
	 * @function generateEncryptedDataAsync
	 * @async
	 * @param {object|string} logObject - The log object to be hashed.
	 * @param {string} [secret] - A custom secret string to encrypt the data, defaults to env APP_SECRET.
	 * @param {boolean} [deterministicToken=false] - Define if generated token should be deterministic.
	 * @return {Promise<string|Error>} Containing the new hash
	 */
	generateEncryptedDataAsync(logObject, secret = "", deterministicToken = false) {
		return new Promise((resolve, reject) => {
			const worker = child.fork(
				path.join(CHILD_PROCESSES_PATH, "encrypt.js")
			);

			worker.send({
				"rawData": typeof logObject === "string" ? logObject : JSON.stringify(logObject),
				"secret": secret || process.env.APP_SECRET,
				"deterministic": deterministicToken
			})
			worker.on("message", value => {
				worker.kill("SIGINT");
				resolve(value);
			});
			worker.on("error", err => reject(err));
		});
	},

	/**
	 * Apply cipher algorithm using the AES algorithm.
	 * @function decryptDataAsync
	 * @async
	 * @param {object|string} encryptedData - The data that had been signed before.
	 * @param {string} [secret] - A custom secret string to encrypt the data, defaults to env APP_SECRET.
	 * @param {boolean} [deterministicToken=false] - Define if token was generated in a deterministic manner.
	 * @return {Promise<String>} Containing the decrypted data
	 */
	decryptDataAsync(encryptedData, secret = "", deterministicToken = false) {
		return new Promise((resolve, reject) => {
			const worker = child.fork(
				path.join(CHILD_PROCESSES_PATH, "decrypt.js")
			);

			worker.send({
				"encryptedData": encryptedData,
				"secret": secret || process.env.APP_SECRET,
				"deterministic": deterministicToken
			});
			worker.on("message", value => {
				worker.kill("SIGINT");
				resolve(value);
			});
			worker.on("error", err => reject(err));
		});
	},




	/**
	 * Generates a Hash from a given data.
	 * @method generateHash
	 * @param {string|Buffer} rawData - Raw data to be hashed.
	 * @param {number} [customRounds=10] - Token to sign the secret, defaults to APP_SECRET env.
	 * @return {Promise<string|Error>} Containing the hashed token.
	 */
	async generateHash(rawData, customRounds = 10) {
		return await hash(
			rawData,
			customRounds
		);
	},


	/**
	 * Compares raw data with a previously generated hash.
	 * @method compareHash
	 * @param {string|Buffer} rawData - Raw data to be compared.
	 * @param {string} hash - Previously hashed password to be compared.
	 * @return {Promise<Boolean|Error>} Containing the hashed token.
	 */
	async compareHash(rawData, hash) {
		return await compare(
			rawData,
			hash
		);
	}
};