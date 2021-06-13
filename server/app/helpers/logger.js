"use strict";

const Log = require("../models/Log");
const raiseError = require("./errorHandler").raiseError;
const DBConnectionPool = require("./DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "LOG_OPERACAO";

module.exports = {

	/**
	 * Creates a new admin User.
	 * @method generateLog
	 * @param {string} logAction - Log action - "CREATE", "EDIT, or "DELETE"
	 * @param {string} referenceId - Reference ID to be logged. E.g: An event's ID.
	 * @param {string} referenceTable - Reference Table that the entity belongs to. E.g: `EVENTOS`
	 * @param {string} operatorAlias - Log operator alias, usually an e-mail or `system`
	 * @param {number|null} [operatorId] - Optional operator foreign key reference to the `USUARIOS` table
	 * @return {Promise<{'LOG_ID': string, 'ID': string}|Error>} Result.
	 */
	async generateLog (
		logAction,
		referenceId,
		referenceTable,
		operatorAlias,
		operatorId
	) {

		const log = new Log(
			logAction,
			referenceId,
			referenceTable,
			operatorAlias,
			operatorId
		);
		const insertKeys = log.getKeys();
		return await connectionPool.executePreparedSqlInstruction(
			[
				`SELECT ID AS LOG_ID, REFERENCIA_ID AS ID FROM FINAL TABLE (INSERT INTO ${TABLE_NAME} (${insertKeys.join(", ")})`,
				`values (${insertKeys.map(() => "?").join(", ")}));`
			].join(" "),
			log.getValues(),
			"fetch"
		);
	},

	/**
	 * Retrieves the count of total Log rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Log objects and request metadata.
	 */
	async retrieveTotalRowsCount () {
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
	 * Search categories.
	 * @method search
	 * @param {string} filterText - Filtering text.
	 * @param {string} [filterColumn="OPERADOR_FANTASIA"] - Optional column selector to use in the SELECT statement.
	 * @param {Array<string>} [extraFilterColumns=[]] - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<object|Error>} Containing the deletion confirmation.
	 */
	async search (filterText, filterColumn = "OPERADOR_FANTASIA", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Logs."
			);
		}

		let {
			searchQuery,
			countQuery
		} = DBConnectionPool.buildSearchQuery(
			targetColumns, TABLE_NAME, filterColumn, filterText, extraFilterColumns, orderBy, orderDirection, skip, limit
		);

		console.log(searchQuery);

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
	 * @return {Promise<Object|Error>} Containing all Log objects and request metadata.
	 */
	async retrieveAll (targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {

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
	 * Retrieves a single Log by ID.
	 * @method retrieveById
	 * @param {string} logId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Log object.
	 */
	async retrieveById (logId, targetColumns = ["*"]) {

		if (!logId) {
			throw raiseError(
				400,
				"Missing required properties for querying Log by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[logId],
			"fetch"
		);

		if (!result) {
			throw raiseError(
				404,
				`Log ID ${logId} not found.`
			);
		} else {
			return result;
		}

	},

	/**
	 * Retrieves a single Log by ID.
	 * @method retrieveLatestCreatedIdByReference
	 * @param {string} referenceTable - Reference Table to search for.
	 * @return {Promise<Object|Error>} Containing the Log object.
	 */
	async retrieveLatestCreatedIdByReference (referenceTable) {

		if (!referenceTable) {
			throw raiseError(
				400,
				"Missing required properties for querying Log by Reference table"
			);
		}

		return (
			(
				(await connectionPool.executePreparedSqlInstruction(
					`SELECT REFERENCIA_ID FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.REFERENCIA_TABELA = ? AND ${TABLE_NAME}.ACAO = 'CREATE' ORDER BY REFERENCIA_ID DESC LIMIT 1;`,
					[referenceTable],
					"fetch"
				)) || {}
			).REFERENCIA_ID || 0
		);
	},
	/**
	 * Retrieves all Log from a given operator.
	 * @method retrieveByOperatorId
	 * @param {string} operatorId - Operator ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Array<Object>|Error>} Containing the Log objects.
	 */
	async retrieveByOperatorId (operatorId, targetColumns = ["*"], orderBy = "ID", orderDirection = "DESC") {

		if (!operatorId) {
			throw raiseError(
				400,
				"Missing required properties for querying Log by ID."
			);
		}

		return await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.OPERADOR_ID = ? ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection};`,
			[operatorId]
		);

	}

};