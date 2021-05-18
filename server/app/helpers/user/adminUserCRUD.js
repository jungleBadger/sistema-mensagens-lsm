"use strict";

const AdminUser = require("../../models/AdminUser");
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
const TABLE_NAME = "USUARIO";
const logger = require("../logger");

module.exports = {

	/**
	 * Creates a new admin User.
	 * @method create
	 * @param {string} userEmail - User email to be added.
	 * @param {string} userPassword - Raw User password to be hashed and stored as the User password.
	 * @param {string|null} [userDisplayName] - Optional User display name
	 * @param {object} operator={} - Operator - e.g: logged user performing the operation.
	 * @param {string|number} operator.id - The operator's ID.
	 * @param {string} operator.email - The operator's email.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create (
		userEmail,
		userPassword,
		userDisplayName = null,
		operator
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

		const adminUser = new AdminUser(
			userEmail,
			await generateHash(userPassword),
			userDisplayName
		);

		const insertKeys = adminUser.getKeys();

		try {

			return {
				...(
					await logger.generateLog(
						"CREATE",
						(await connectionPool.executePreparedSqlInstruction(
							[
								`(SELECT ID FROM FINAL TABLE (insert INTO ${TABLE_NAME} (${insertKeys.join(", ")})`,
								`values (${insertKeys.map(() => "?").join(", ")})))`
							].join(" "),
							adminUser.getValues(),
							"fetch"
						)).ID,
						TABLE_NAME,
						operator.email,
						operator.id
					)
				),
				"EMAIL": adminUser.model.EMAIL,
				"ADMINISTRADOR": adminUser.model.ADMINISTRADOR
			};


		} catch (e) {
			if (e && e.indexOf && e.indexOf("SQLSTATE=23505") > -1) {
				throw raiseError(
					409,
					`User ${userEmail} already exists.`
				);
			} else {
				throw e;
			}
		}
	},

	/**
	 * Retrieves the count of total Admin users rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Admin users objects and request metadata.
	 */
	async retrieveTotalRowsCount() {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				`SELECT COUNT(ID) FROM ${TABLE_NAME};`,
				[],
				"fetch"
			))["1"]
		};
	},

	/**
	 * Search admin users.
	 * @method search
	 * @param {string} filterText - Filtering text.
	 * @param {string} [filterColumn="NOME_EXIBICAO"] - Optional column selector to use in the SELECT statement.
	 * @param {Array<string>} [extraFilterColumns=[]] - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<object|Error>} Containing the deletion confirmation.
	 */
	async search (filterText, filterColumn = "NOME_EXIBICAO", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Brother."
			);
		}

		console.log([
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME}`,
			`WHERE ${TABLE_NAME}.ADMINISTRADOR = true AND (LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%')`,
			extraFilterColumns.map((column) => `OR LOWER(${TABLE_NAME}.${column}) LIKE LOWER('%${filterText}%')`).join(" ") + ")",
			`ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection}`,
			`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
			";"
		].join(" "));

		let [results, countResults] = await Promise.all([
			connectionPool.executeRawSqlInstruction(
				[
					`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME}`,
					`WHERE ${TABLE_NAME}.ADMINISTRADOR = true AND (LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${TABLE_NAME}.${column}) LIKE LOWER('%${filterText}%')`).join(" ") + ")",
					`ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection}`,
					`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
					";"
				].join(" "),
				[]
			),
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT(ID) FROM ${TABLE_NAME}`,
					`WHERE ${TABLE_NAME}.ADMINISTRADOR = true AND (LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${TABLE_NAME}.${column}) LIKE LOWER('%${filterText}%')`).join(" ") + ")",
					";"
				].join(" "),
				[],
				"fetch"
			)
		]);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"orderDirection": orderDirection,
			"totalCount": countResults["1"],
			"results": results
		};
	},

	/**
	 * Retrieves all admin users.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAll (targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {

		let results = await connectionPool.executeRawSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ADMINISTRADOR = true ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		};

	},

	/**
	 * Retrieves a single admin User by ID.
	 * @method retrieveById
	 * @param {string} adminUserId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the admin User object.
	 */
	async retrieveById (adminUserId, targetColumns = ["*"]) {

		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[adminUserId],
			"fetch"
		);

		if (!result) {
			throw raiseError(
				404,
				`User ID ${adminUserId} not found.`
			);
		} else {
			if (!result.ADMINISTRADOR) {
				throw raiseError(
					403,
					"User is not an administrator."
				);
			} else {
				return result;
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
	async retrieveByEmail (adminUserEmail, targetColumns = ["*"]) {

		if (!adminUserEmail) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.EMAIL = ? LIMIT 1;`,
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

	update (adminUserId, adminUserObject) {

	},

	/**
	 * Delete a single admin User.
	 * @method delete
	 * @param {string} adminUserId - ID to search for and delete.
	 * @param {object} operator={} - Operator - e.g: logged user performing the operation.
	 * @param {string|number} operator.id - The operator's ID.
	 * @param {string} operator.email - The operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (adminUserId, operator) {
		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for deleting admin User."
			);
		}

		await this.retrieveById(adminUserId, ["ID", "ADMINISTRADOR"]);
		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? AND ${TABLE_NAME}.ADMINISTRADOR = ?;`,
			[adminUserId, true]
		);

		return await logger.generateLog(
			"DELETE",
			adminUserId,
			TABLE_NAME,
			operator.email,
			operator.id
		);
	}
};