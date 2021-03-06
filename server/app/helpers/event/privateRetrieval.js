"use strict";

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
const db2Timestamp = require("../db2Timestamp");

module.exports = {

	/**
	 * Retrieves the count of total Brothers rows.
	 * @method retrieveTotalRowsCount
	 * @param {string} userId
	 * @return {Promise<Object|Error>} Containing all Brother objects and request metadata.
	 */
	async retrieveTotalRowsCount (userId) {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT FROM (SELECT DISTINCT EVENTO.ID`,
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID)`,
					"WHERE (P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO'))",
					");"
				].join(" "),
				[Number(userId)],
				"fetch"
			))["1"]
		};
	},

	/**
	 * Search events.
	 * @method search
	 * @param {string} userId
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
	async search (userId, filterText, filterColumn = "TITULO", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {
		if (!userId || !filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Event."
			);
		}

		let [results, countResults] = await Promise.all([
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT ${targetColumns.map(column => `${column}`).join(", ")},`,
					"COUNT(DISTINCT M.ID) AS TOTAL_MENSAGENS, LISTAGG(DISTINCT M.ID, ',') AS MENSAGENS, C.NOME AS CATEGORIA_NOME,",
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO) AS LOCALIDADE",
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
					JOIN IRMAO I on M.IRMAO_ID = I.ID
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID)`,
					"WHERE (P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO')) AND",
					`(LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%') OR`,
					`LOWER((L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" "),
					`) GROUP BY C.NOME, ${targetColumns.map(column => `${column}`).join(", ")},`,
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)",
					`ORDER BY ${orderBy} ${orderDirection}`,
					`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
					";"
				].join(" "),
				[Number(userId)]
			),
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT FROM (SELECT DISTINCT EVENTO.ID`,
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					LEFT JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
					JOIN IRMAO I on M.IRMAO_ID = I.ID
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID) WHERE`,
					"(P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO')) AND",
					`(LOWER(${TABLE_NAME}.${filterColumn}) LIKE LOWER('%${filterText}%') OR`,
					`LOWER((L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)) LIKE LOWER('%${filterText}%')`,
					extraFilterColumns.map((column) => `OR LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" "),
					"));"
				].join(" "),
				[Number(userId)],
				"fetch"
			)
		]);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"orderDirection": orderDirection,
			"totalCount": countResults["1"],
			"results": await Promise.all(
				results.map(async event => {
					return {
						...event,
						"MENSAGENS": await connectionPool.executeRawSqlInstruction(
							[
								"SELECT M.ID, ORDEM, TITULO, VALOR, DATA_MINISTRADO, IRMAO_ID, HABILITADO, M.CRIADO_EM, I.NOME_EXIBICAO AS IRMAO_NOME, CAMINHO_ARQUIVO_ESBOCO ",
								"FROM MENSAGEM M JOIN IRMAO I ON M.IRMAO_ID = I.ID",
								`WHERE M.ID IN ( ${event.MENSAGENS} ) ORDER BY M.ORDEM;`
							].join(" ")
						)
					};
				})
			)
		};
	},

	/**
	 * Search events.
	 * @method advancedSearch
	 * @param {object} advancedFilters - Filtering text.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @param {string} [userId=""] - Optional user ID to filter.
	 * @return {Promise<object|Error>} Containing the deletion confirmation.
	 */
	async advancedSearch (advancedFilters, targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC", userId = "") {
		if (!advancedFilters || !userId) {
			throw raiseError(
				400,
				"Missing required properties for advanced search."
			);
		}

		let advancedQueryString = [
			`(P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO'))`,
			advancedFilters.eventTitle ? `(LOWER(EVENTO.TITULO) LIKE LOWER(?))` : "",
			advancedFilters.messageTitle ? `(LOWER(M.TITULO) LIKE LOWER(?))` : "",
			advancedFilters.startDate && advancedFilters.endDate ? "(M.DATA_MINISTRADO BETWEEN ? AND ? )" : "",
			`(${(advancedFilters.selectedBrothers || []).map(() => "M.IRMAO_ID = ?").join(" OR ")})`,
			`(${(advancedFilters.selectedCategories || []).map(() => "EVENTO.CATEGORIA_ID = ?").join(" OR ")})`,
			`(${(advancedFilters.selectedLocations || []).map(() => "EVENTO.LOCALIDADE_ID = ?").join(" OR ")})`
		].filter(
			item => item && item !== "()"
		).join(" AND ");

		let advancedParams = [
			userId,
			advancedFilters.eventTitle ? `%${advancedFilters.eventTitle}%` : "",
			advancedFilters.messageTitle ? `%${advancedFilters.messageTitle}%` : "",
			...(advancedFilters.startDate && advancedFilters.endDate ? [
				db2Timestamp(advancedFilters.startDate),
				db2Timestamp(advancedFilters.endDate)
			] : []),
			...advancedFilters.selectedBrothers,
			...advancedFilters.selectedCategories,
			...advancedFilters.selectedLocations
		].filter(
			item => item && item !== "()"
		);

		if (!advancedQueryString) {
			throw raiseError(
				400,
				"Invalid advanced query."
			);
		}

		let [results, countResults] = await Promise.all([
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT ${targetColumns.map(column => `${column}`).join(", ")},`,
					"COUNT(DISTINCT M.ID) AS TOTAL_MENSAGENS, LISTAGG(DISTINCT M.ID, ',') AS MENSAGENS, C.NOME AS CATEGORIA_NOME,",
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO) AS LOCALIDADE",
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID)`,

					"WHERE M.HABILITADO = TRUE AND M.CAMINHO_ARQUIVO_AUDIO > '' AND (",

					advancedQueryString,

					`) GROUP BY C.NOME, ${targetColumns.map(column => `${column}`).join(", ")},`,
					"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)",
					`ORDER BY ${orderBy} ${orderDirection}`,
					`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
					";"
				].join(" "),
				advancedParams
			),
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT FROM (SELECT DISTINCT EVENTO.ID`,
					`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID)
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID`,
					"WHERE M.HABILITADO = TRUE AND M.CAMINHO_ARQUIVO_AUDIO > '' AND (",

					advancedQueryString,

					"));"
				].join(" "),
				advancedParams,
				"fetch"
			)
		]);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"orderDirection": orderDirection,
			"totalCount": countResults["1"],
			"results": await Promise.all(
				results.map(async event => {
					return {
						...event,
						"MENSAGENS": await connectionPool.executeRawSqlInstruction(
							[
								"SELECT M.ID, ORDEM, TITULO, VALOR, DATA_MINISTRADO, IRMAO_ID, HABILITADO, M.CRIADO_EM, I.NOME_EXIBICAO AS IRMAO_NOME, CAMINHO_ARQUIVO_ESBOCO ",
								"FROM MENSAGEM M JOIN IRMAO I ON M.IRMAO_ID = I.ID",
								`WHERE M.ID IN ( ${event.MENSAGENS} ) ORDER BY M.ORDEM;`
							].join(" ")
						)
					};
				})
			)
		};
	},

	/**
	 * Retrieves all events.
	 * @method retrieveAll
	 * @param {String} userId.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAll (userId, targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection = "DESC") {

		let results = await connectionPool.executePreparedSqlInstruction(
			[
				`SELECT ${targetColumns.map(column => `${column}`).join(", ")},`,
				"COUNT(DISTINCT M.ID) AS TOTAL_MENSAGENS, LISTAGG(DISTINCT M.ID, ',') AS MENSAGENS, C.NOME AS CATEGORIA_NOME,",
				"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO) AS LOCALIDADE",
				`FROM (
					${TABLE_NAME}
					JOIN LOCALIDADE L on ${TABLE_NAME}.LOCALIDADE_ID = L.ID
					JOIN CATEGORIA C on ${TABLE_NAME}.CATEGORIA_ID = C.ID
					JOIN MENSAGEM M on ${TABLE_NAME}.ID = M.EVENTO_ID
					LEFT JOIN PEDIDO_ITEM PI ON M.ID = PI.MENSAGEM_ID
					LEFT JOIN PEDIDO P ON PI.PEDIDO_ID = P.ID
					LEFT JOIN PEDIDO_STATUS PS ON P.STATUS_ID = PS.ID
				)`,
				"WHERE (P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO'))",
				`GROUP BY C.NOME, ${targetColumns.map(column => `${column}`).join(", ")},`,
				"(L.PAIS concat ' - ' concat L.CIDADE concat ' - ' concat L.ESTADO)",
				`ORDER BY ${orderBy} ${orderDirection}`,
				`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
				";"
			].join(" "),
			[Number(userId)]
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"orderDirection": orderDirection,
			"results": await Promise.all(
				results.map(async event => {
					return {
						...event,
						"MENSAGENS": await connectionPool.executeRawSqlInstruction(
							[
								"SELECT M.ID, ORDEM, TITULO, VALOR, DATA_MINISTRADO, IRMAO_ID, HABILITADO, M.CRIADO_EM, I.NOME_EXIBICAO AS IRMAO_NOME, CAMINHO_ARQUIVO_ESBOCO ",
								"FROM MENSAGEM M JOIN IRMAO I ON M.IRMAO_ID = I.ID",
								`WHERE M.ID IN ( ${event.MENSAGENS} ) ORDER BY M.ORDEM;`
							].join(" ")
						)
					};
				})
			)
		};

	},

	/**
	 * Retrieves a single Brother by ID.
	 * @method retrieveById
	 * @param {string} userId - user ID to search for.
	 * @param {string} eventId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Brother object.
	 */
	async retrieveById (userId, eventId, targetColumns = ["*"]) {

		if (!eventId) {
			throw raiseError(
				400,
				"Missing required properties for querying Brother by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? AND (P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO')) LIMIT 1;`,
			[Number(userId), Number(eventId)]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Event ID ${eventId} not found.`
			);
		} else {
			return result[0];
		}
	}
};