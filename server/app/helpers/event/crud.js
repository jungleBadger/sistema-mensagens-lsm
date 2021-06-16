"use strict";

const Event = require("../../models/Event");
const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "EVENTO";
const logger = require("../logger");

module.exports = {

	/**
	 * @method create
	 * @param {object} payload - Event payload.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create (
		payload,
		operator
	) {
		const event = new Event(
			payload.title,
			payload.startDate,
			payload.endDate,
			payload.categoryId,
			payload.locationId,
			payload.description
		);

		const insertKeys = event.getKeys();

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
							event.getValues(),
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
					`Event already exists.`
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
	 * Search events.
	 * @method search
	 * @param {string} filterText - Filtering text.
	 * @param {string} [filterColumn="TITULO"] - Optional column selector to use in the SELECT statement.
	 * @param {Array<string>} [extraFilterColumns=[]] - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<object|Error>} Containing the deletion confirmation.
	 */
	async search (filterText, filterColumn = "TITULO", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Event."
			);
		}

		let [results, countResults] = await Promise.all([
			connectionPool.executeRawSqlInstruction(
				[
					`SELECT ${targetColumns.map(column => `${column}`).join(", ")},`,
					"COUNT(M.ID) AS TOTAL_MENSAGENS, C.NOME AS CATEGORIA_NOME,",
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO) AS LOCALIDADE",
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					LEFT JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
			)`,
					`WHERE LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%') OR`,
					`LOWER((L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" "),
					`GROUP BY C.NOME, ${targetColumns.map(column => `${column}`).join(", ")},`,
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)",
					`ORDER BY ${orderBy} ${orderDirection}`,
					`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
					";"
				].join(" "),
				[]
			),
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT(EVENTO.ID)`,
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					LEFT JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
			)`,
					`WHERE LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%') OR`,
					`LOWER((L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" "),
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
	 * Retrieves all events.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAll (targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {
		let results = await connectionPool.executeRawSqlInstruction(
			[
				`SELECT ${targetColumns.map(column => `${TABLE_NAME}.${column}`).join(", ")},`,
				"COUNT(M.ID) AS TOTAL_MENSAGENS, C.NOME AS CATEGORIA_NOME,",
				"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO) AS LOCALIDADE",
				`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					LEFT JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
				)`,
				`GROUP BY C.NOME, ${targetColumns.map(column => `${TABLE_NAME}.${column}`).join(", ")},`,
				"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)",
				`ORDER BY ${orderBy} ${orderDirection}`,
				`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
				";"
			].join(" ")
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
	 * @param {string} eventId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Brother object.
	 */
	async retrieveById (eventId, targetColumns = ["*"]) {

		if (!eventId) {
			throw raiseError(
				400,
				"Missing required properties for querying Brother by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[eventId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Event ID ${eventId} not found.`
			);
		} else {
			return result[0];
		}
	},

	/**
	 * Updates a single Brother's Display name.
	 * @method update
	 * @param {string} eventId - Brother ID to search for.
	 * @param {object} payload - Event payload.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the brother object.
	 */
	async update (eventId, payload, operator) {
		if (!eventId || !payload) {
			throw raiseError(
				400,
				"Missing required properties for updating Event by ID."
			);
		}

		const updatedEvent = new Event(
			payload.title,
			payload.startDate,
			payload.endDate,
			payload.categoryId,
			payload.locationId,
			payload.description
		);

		await this.retrieveById(eventId);

		try {
			await connectionPool.executePreparedSqlInstruction(
				`UPDATE ${TABLE_NAME} SET ${TABLE_NAME}.TITULO = ?, ${TABLE_NAME}.DATA_INICIO = ?, ${TABLE_NAME}.DATA_FIM = ?, ${TABLE_NAME}.CATEGORIA_ID = ?, ${TABLE_NAME}.LOCALIDADE_ID = ?, ${TABLE_NAME}.DESCRICAO = ?, ${TABLE_NAME}.ATUALIZADO_EM = ? WHERE ${TABLE_NAME}.ID = ? `,
				[updatedEvent.model.TITULO, updatedEvent.model.DATA_INICIO, updatedEvent.model.DATA_FIM, updatedEvent.model.CATEGORIA_ID, updatedEvent.model.LOCALIDADE_ID, updatedEvent.model.DESCRICAO, updatedEvent.model.ATUALIZADO_EM, eventId]
			);
		} catch (e) {
			console.log(e);
			throw e;
		}

		return {
			...(await logger.generateLog(
				"UPDATE",
				eventId,
				TABLE_NAME,
				operator.email,
				Number(operator.id)
			)),
			...(updatedEvent.model)
		};

	},

	/**
	 * Delete a single Event.
	 * @method delete
	 * @param {string} eventId - ID to search for and delete.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (eventId, operator) {
		if (!eventId) {
			throw raiseError(
				400,
				"Missing required properties for deleting Event."
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ?;`,
			[eventId]
		);

		return await logger.generateLog(
			"DELETE",
			eventId,
			TABLE_NAME,
			operator.email,
			Number(operator.id)
		);

	}

};