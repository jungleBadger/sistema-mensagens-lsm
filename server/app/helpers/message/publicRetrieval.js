"use strict";

const DBConnectionPool = require("../DBConnectionPool");
const { raiseError } = require("../errorHandler");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "MENSAGEM";

module.exports = {

	/**
	 * Retrieves a single Message by ID.
	 * @method retrieveById
	 * @param {string} messageId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Message object.
	 */
	async retrieveById (messageId, targetColumns = ["*"]) {

		if (!Number(messageId)) {
			throw raiseError(
				400,
				"Missing required properties for querying Message by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[messageId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Message ID ${messageId} not found.`
			);
		} else {
			return result[0];
		}
	},

	/**
	 * Retrieves the count of total Brothers rows.
	 * @method retrieveTotalRowsByEventCount
	 * @return {Promise<Object|Error>} Containing all Brother objects and request metadata.
	 */
	async retrieveTotalRowsByEventCount(eventId) {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				`SELECT COUNT(ID) FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.HABILITADO = TRUE AND ${TABLE_NAME}.CAMINHO_ARQUIVO_AUDIO > '' AND ${TABLE_NAME}.EVENTO_ID = ?;`,
				[eventId],
				"fetch"
			))["1"]
		};
	},



	/**
	 * Retrieves all messages by an Event ID.
	 * @method retrieveAllByEventId
	 * @param {string} eventId - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAllByEventId (eventId, targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {

		let results = await connectionPool.executeRawSqlInstruction(
			[
				`SELECT ${targetColumns.map(column => `${column}`).join(", ")}`,
				`FROM ${TABLE_NAME} JOIN IRMAO I ON ${TABLE_NAME}.IRMAO_ID = I.ID`,
				`WHERE ${TABLE_NAME}.HABILITADO = TRUE AND ${TABLE_NAME}.CAMINHO_ARQUIVO_AUDIO > '' AND ${TABLE_NAME}.EVENTO_ID = ${Number(eventId)}`,
				`ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection}`,
				`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
				";"
			].join(" ")
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		};
	}


};