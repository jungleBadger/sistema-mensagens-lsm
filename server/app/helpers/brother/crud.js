"use strict";

const Brother = require("../../models/Brother");
const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "IRMAO";
const logger = require("../logger");

module.exports = {

	/**
	 * Creates a new admin User.
	 * @method create
	 * @param {string} displayName - Display name.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create (
		displayName,
		operator
	) {
		const brother = new Brother(
			displayName
		);

		const insertKeys = brother.getKeys();

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
							brother.getValues(),
							"fetch"
						)).ID,
						TABLE_NAME,
						operator.email,
						Number(operator.id)
					)
				)
			};


		} catch (e) {
			if (e && e.indexOf && e.indexOf("duplicate values") > -1) {
				throw raiseError(
					409,
					`Brother ${displayName} already exists.`
				);
			} else {
				throw e;
			}
		}
	},

	/**
	 * Retrieves the count of total Brothers rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Brother objects and request metadata.
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
	 * Search brothers.
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

		let {
			searchQuery,
			countQuery
		} = DBConnectionPool.buildSearchQuery(
			targetColumns, TABLE_NAME, filterColumn, filterText, extraFilterColumns, orderBy, orderDirection, skip, limit
		);

		let [results, countResults] = await Promise.all([
			connectionPool.executeRawSqlInstruction(
				searchQuery,
				[]
			),
			connectionPool.executePreparedSqlInstruction(
				countQuery,
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
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		};

	},

	/**
	 * Retrieves a single Brother by ID.
	 * @method retrieveById
	 * @param {string} brotherId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Brother object.
	 */
	async retrieveById (brotherId, targetColumns = ["*"]) {

		if (!brotherId) {
			throw raiseError(
				400,
				"Missing required properties for querying Brother by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[brotherId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Brother ID ${brotherId} not found.`
			);
		} else {
			return result[0];
		}

	},

	/**
	 * Retrieves a single Brother by Display name.
	 * @method retrieveByDisplayName
	 * @param {string} brotherName - Display name to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the brother object.
	 */
	async retrieveByDisplayName (brotherName, targetColumns = ["*"]) {

		if (!brotherName) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.NOME_EXIBICAO = ? LIMIT 1;`,
			[brotherName]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Brother ${brotherName} not found.`
			);
		} else {
			return result[0];
		}

	},

	/**
	 * Updates a single Brother's Display name.
	 * @method update
	 * @param {string} brotherId - Brother ID to search for.
	 * @param {string} newDisplayName - New display name.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the brother object.
	 */
	async update (brotherId, newDisplayName, operator) {
		if (!brotherId || !newDisplayName) {
			throw raiseError(
				400,
				"Missing required properties for updating Brother by ID."
			);
		}

		await this.retrieveById(brotherId);


		try {
			await connectionPool.executePreparedSqlInstruction(
				`UPDATE ${TABLE_NAME} SET ${TABLE_NAME}.NOME_EXIBICAO = ? WHERE ${TABLE_NAME}.ID = ?;`,
				[newDisplayName, brotherId]
			);
		} catch (e) {
			console.log(e);
			if (e && e.indexOf && e.indexOf("duplicate values") > -1) {
				throw raiseError(
					409,
					`Brother ${newDisplayName} already exists.`
				);
			} else {
				throw e;
			}
		}

		return {
			...(await logger.generateLog(
				"UPDATE",
				brotherId,
				TABLE_NAME,
				operator.email,
				Number(operator.id)
			)),
			"NOME_EXIBICAO": newDisplayName
		};

	},

	/**
	 * Delete a single admin User.
	 * @method delete
	 * @param {string} brotherId - ID to search for and delete.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (brotherId, operator) {
		if (!brotherId) {
			throw raiseError(
				400,
				"Missing required properties for deleting Brother."
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ?;`,
			[brotherId]
		);

		return await logger.generateLog(
			"DELETE",
			brotherId,
			TABLE_NAME,
			operator.email,
			Number(operator.id)
		);

	},


};