"use strict";

const User = require("../../models/User");
const raiseError = require("../errorHandler").raiseError;
const { generateHash, generateJWT } = require("../security");
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const mailerTransport = require("../mailer");
const welcomeEmailObject = require("../../templates/email/welcome");
const nodemailer = require("nodemailer");
const logger = require("../logger");

const TABLE_NAME = "USUARIO";


module.exports = {

	/**
	 * Creates a new User.
	 * @method create
	 * @param {string} userEmail - User email to be added.
	 * @param {string} userPassword - Raw User password to be hashed and stored as the User password.
	 * @param {string|null} [userDisplayName] - Optional User display name
	 * @param {boolean} [passwordRegistered=true] - Optional flag to define if the password is confirmed. Default is
	 * `true`, and `false` represents an account created through social providers
	 * @param {object} [operator={}] - Operator - e.g: logged user performing the operation.
	 * @param {string|number|null} [operator.id] - The optional operator's ID. Default to `null`
	 * @param {string} [operator.email] - The optional operator's email. Default to ` system`
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */

	async create(
		userEmail,
		userPassword,
		userDisplayName = null,
		passwordRegistered = true,
		operator = {
			"id": null,
			"email": "system"
		}
	) {

		if (!userEmail || !userPassword) {
			throw raiseError(
				400,
				"Missing required properties for creating User."
			);
		} else if (userPassword.length < 8) {
			throw raiseError(
				400,
				"Password has to have a length greater or equal to 08."
			);
		}

		const user = new User(
			userEmail,
			await generateHash(userPassword),
			userDisplayName,
			passwordRegistered
		);

		const insertKeys = user.getKeys();

		try {
			let result = (
				await logger.generateLog(
					"CREATE",
					(await connectionPool.executePreparedSqlInstruction(
						[
							`SELECT ID FROM FINAL TABLE (INSERT INTO ${TABLE_NAME} (${insertKeys.join(", ")})`,
							`values (${insertKeys.map(() => '?').join(", ")}));`
						].join(" "),
						user.getValues(),
						"fetch"
					)).ID,
					TABLE_NAME,
					operator.email,
					operator.id
				)
			);


			//@TODO Review the mailer default options
			let mailResult = await mailerTransport.sendMail({
				"to": userEmail, // list of receivers
				"subject": welcomeEmailObject.subject,
				"text": welcomeEmailObject.text,
				"html": welcomeEmailObject.html(
					"https://localhost:3030/api/common/user/confirm",
					await generateJWT(
						{ userEmail },
						process.env.APP_SECRET,
						{
							"expiresIn": "08 hours",
							"audience": "single_user"
						}
					)
				)
			});

			//@TODO Remove this log statement later - demo purposes only.
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(mailResult));

			return {
				"ID": result.ID,
				"LOG_ID": result.LOG_ID,
				"EMAIL": userEmail
			};

		} catch (e) {
			console.log(e)
			if (e && e.indexOf("SQLSTATE=23505") > -1) {
				throw raiseError(
					409,
					`User ${userEmail} already exists.`
				);
			}
		}
	},

	/**
	 * Retrieves all Users.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all Users objects and request metadata.
	 */
	async retrieveAll(targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {

		let results = await connectionPool.executeRawSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ADMINISTRADOR = false ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		}

	},

	/**
	 * Retrieves a single User by ID.
	 * @method retrieveById
	 * @param {string} userId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the User object.
	 */
	async retrieveById(userId, targetColumns = ["*"]) {

		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for querying User by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ID = ? LIMIT 1;`,
			[userId],
			"fetch"
		);

		if (!result) {
			throw raiseError(
				404,
				`User ID ${userId} not found.`
			);
		} else {
			return result;
		}

	},

	/**
	 * Retrieves a single User by Email.
	 * @method retrieveByEmail
	 * @param {string} userEmail - Email to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {boolean} [acceptNotFound=false] - Optional boolean that controls if the not found error should be bypassed.
	 * @return {Promise<Object|null|Error>} Containing the User object.
	 */
	async retrieveByEmail(userEmail, targetColumns = ["*"], acceptNotFound = false) {

		if (!userEmail) {
			throw raiseError(
				400,
				"Missing required properties for querying User by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.EMAIL = ? LIMIT 1;`,
			[userEmail]
		);

		if (!result || !result.length) {

			if (acceptNotFound) {
				return null;
			} else {
				throw raiseError(
					404,
					`User email ${userEmail} not found.`
				);
			}

		} else {
			return result[0];
		}

	},

	/**
	 * Update User profile by confirming email.
	 * @method updateAccountConfirmation
	 * @param {string} userEmail - Email to search for and validate.
	 * @return {Promise<string|Error>} Containing the operation confirmation.
	 */
	async updateAccountConfirmation(userEmail) {

		let userProfile = await this.retrieveByEmail(userEmail, ["ID"]);

		await connectionPool.executePreparedSqlInstruction(
			`UPDATE USUARIO SET USUARIO.EMAIL_CONFIRMADO = ? WHERE USUARIO.ID = ?;`,
			[true, userProfile.ID]
		);

		return `The system successfully confirmed the User ${userProfile.ID} email.`;
	},

	/**
	 * Delete a single User.
	 * @method delete
	 * @param {string} userId - ID to search for and delete.
	 * @param {object} operator={} - Operator - e.g: logged user performing the operation.
	 * @param {string|number} operator.id - The operator's ID.
	 * @param {string} operator.email - The operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete(userId, operator) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for deleting User."
			);
		}

		let user = await this.retrieveById(userId, ["ID", "ADMINISTRADOR"]);

		if (user.ADMINISTRADOR) {
			throw raiseError(
				403,
				`Operationr blocked - User ${userId} is an administrator.`
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM USUARIO WHERE USUARIO.ID = ? AND USUARIO.ADMINISTRADOR = ?;`,
			[userId, false]
		);

		return await logger.generateLog(
			"DELETE",
			userId,
			TABLE_NAME,
			operator.email,
			operator.id
		);
	}
}