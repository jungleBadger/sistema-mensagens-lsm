"use strict";

const Crud = require("../../models/AdminUser");
const raiseError = require("../errorHandler").raiseError;
const { generateHash, compareHash } = require("../security");
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
	 * Creates a new admin User.
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
				"Missing required properties for creating admin User."
			);
		} else if (userPassword.length < 8) {
			throw raiseError(
				400,
				"Password has to have a length greater or equal to 08."
			);
		}

		const adminUser = new Crud(
			userEmail,
			await generateHash(userPassword),
			userDisplayName
		);

		const insertKeys = adminUser.getKeys();

		try {
			await connectionPool.executePreparedSqlInstruction(
				[
					`insert into USUARIO (${insertKeys.join(", ")})`,
					`values (${insertKeys.map(key => '?').join(", ")});`
				].join(" "),
				adminUser.getValues(),
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
	 * Retrieves all admin users.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAll(targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID") {

		let results = await connectionPool.executeRawSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ADMINISTRADOR = true OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		}

	},

	/**
	 * Retrieves a single admin User by ID.
	 * @method retrieveById
	 * @param {string} adminUserId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the admin User object.
	 */
	async retrieveById(adminUserId, targetColumns = ["*"]) {

		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ID = ? LIMIT 1;`,
			[adminUserId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`User ID ${adminUserId} not found.`
			);
		} else {
			if (!result[0].ADMINISTRADOR) {
				throw raiseError(
					403,
					"User is not an administrator."
				);
			} else {
				return result[0];
			}
		}

	},

	/**
	 * Retrieves a single admin User by Email.
	 * @method retrieveByEmail
	 * @param {string} adminUserEmail - Email to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the admin User object.
	 */
	async retrieveByEmail(adminUserEmail, targetColumns = ["*"]) {

		if (!adminUserEmail) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.EMAIL = ? LIMIT 1;`,
			[adminUserEmail]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`User email ${adminUserEmail} not found.`
			);
		} else {
			if (!result[0].ADMINISTRADOR) {
				throw raiseError(
					403,
					"User is not an administrator."
				);
			} else {
				return result[0];
			}
		}

	},

	update(adminUserId, adminUserObject) {

	},

	/**
	 * Delete a single admin User.
	 * @method delete
	 * @param {string} adminUserId - ID to search for and delete.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete(adminUserId) {
		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for deleting admin User."
			);
		}

		await this.retrieveById(adminUserId);

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM USUARIO WHERE USUARIO.ID = ?;`,
			[adminUserId],
			false
		);

		return `User ${adminUserId} deleted`;
	}
}