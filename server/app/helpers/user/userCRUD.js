"use strict";

const User = require("../../models/User");
const raiseError = require("../errorHandler").raiseError;
const { generateHash } = require("../security");
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

module.exports = {

	/**
	 * Creates a new User.
	 * @method create
	 * @param {string} userEmail - User email to be added.
	 * @param {string} userPassword - Raw User password to be hashed and stored as the User password.
	 * @param {string|null} [userDisplayName] - Optional User display name
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create(
		userEmail,
		userPassword,
		userDisplayName = null
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
			userDisplayName
		);

		const insertKeys = user.getKeys();

		try {
			await connectionPool.executePreparedSqlInstruction(
				[
					`insert into USUARIO (${insertKeys.join(", ")})`,
					`values (${insertKeys.map(() => '?').join(", ")});`
				].join(" "),
				user.getValues(),
				false
			);
			return await this.retrieveByEmail(userEmail, ["ID", "EMAIL"]);
		} catch (e) {
			if (e && e.indexOf("SQLSTATE=23505" > -1)) {
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
	 * @return {Promise<Object|Error>} Containing all Users objects and request metadata.
	 */
	async retrieveAll(targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID") {

		let results = await connectionPool.executeRawSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ADMINISTRADOR = false OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
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
			[userId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`User ID ${userId} not found.`
			);
		} else {
			return result[0];
		}

	},

	/**
	 * Retrieves a single User by Email.
	 * @method retrieveByEmail
	 * @param {string} userEmail - Email to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the User object.
	 */
	async retrieveByEmail(userEmail, targetColumns = ["*"]) {

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
			throw raiseError(
				404,
				`User email ${userEmail} not found.`
			);
		} else {
			return result[0];
		}

	},

	update(userId, userObject) {

	},

	/**
	 * Delete a single User.
	 * @method delete
	 * @param {string} userId - ID to search for and delete.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete(userId) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for deleting User."
			);
		}

		await this.retrieveById(userId);

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM USUARIO WHERE USUARIO.ID = ? AND USUARIO.ADMINISTRADOR = false;`,
			[userId],
			false
		);

		return `User ${userId} deleted`;
	}
}