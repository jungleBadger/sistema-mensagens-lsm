"use strict";

const Message = require("../../models/Message");
const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);



const TABLE_NAME = "MENSAGEM";
const logger = require("../logger");
const db2Timestamp = require("../db2Timestamp");

module.exports = {

	/**
	 * @method create
	 * @param {object} payload - Message payload.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create (
		payload,
		operator
	) {
		const message = new Message(
			payload.order,
			payload.title,
			payload.brotherId,
			payload.eventId,
			payload.messageDate,
			payload.messageValue,
			payload.audioFilePath,
			payload.pdfFilePath,
			payload.isEnabled
		);

		const insertKeys = message.getKeys();

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
							message.getValues(),
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
					`Message already exists.`
				);
			} else {
				throw e;
			}
		}
	},

	/**
	 * Retrieves the count of total Messages rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Message objects and request metadata.
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
	 * Search messages.
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
	async search (filterText, filterColumn = "TITULO", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Message."
			);
		}

		//@ TODO Rework search query to consider joined tables
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
	 * Retrieves all messages.
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
			[
				`SELECT ${targetColumns.map(column => `${TABLE_NAME}.${column}`).join(", ")},`,
				`FROM ${TABLE_NAME}`,
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
	},

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
	 * Updates a single Message's Display name.
	 * @method update
	 * @param {string} messageId - Message ID to search for.
	 * @param {object} payload - Message payload.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the brother object.
	 */
	async update (messageId, payload, operator) {
		if (!messageId || !payload) {
			throw raiseError(
				400,
				"Missing required properties for updating Message by ID."
			);
		}

		const updatedMessage = new Message(
			payload.order,
			payload.title,
			payload.brotherId,
			payload.eventId,
			payload.messageDate,
			payload.messageValue,
			payload.audioFilePath,
			payload.pdfFilePath,
			payload.isEnabled
		);

		await this.retrieveById(messageId);

		let columns = [
			"TITULO",
			"IRMAO_ID",
			"DATA_MINISTRADO",
			"CAMINHO_ARQUIVO_AUDIO",
			"CAMINHO_ARQUIVO_ESBOCO",
			"HABILITADO",
			"ATUALIZADO_EM",
		];

		try {
			await connectionPool.executePreparedSqlInstruction(
				`UPDATE ${TABLE_NAME} SET ${columns.map(column => `${TABLE_NAME}.${column} = ?`).join(", ")} WHERE ${TABLE_NAME}.ID = ? `,
				[
					...columns.map(column => updatedMessage.model[column]),
					messageId
				]
			);
		} catch (e) {
			console.log(e);
			throw e;
		}

		return {
			...(await logger.generateLog(
				"UPDATE",
				messageId,
				TABLE_NAME,
				operator.email,
				Number(operator.id)
			)),
			...(updatedMessage.model)
		};
	},

	/**
	 * Delete a single Message.
	 * @method delete
	 * @param {string} messageId - ID to search for and delete.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (messageId, operator) {
		if (!messageId) {
			throw raiseError(
				400,
				"Missing required properties for deleting Message."
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ?;`,
			[messageId]
		);

		return await logger.generateLog(
			"DELETE",
			messageId,
			TABLE_NAME,
			operator.email,
			Number(operator.id)
		);

	},


	async organizeMessages(messages) {

		let moment = db2Timestamp();

		return await connectionPool.executeOperationsWithinTransaction(
			messages.map(
				message => {
					return `UPDATE ${TABLE_NAME} SET ${TABLE_NAME}.ORDEM = ${message.order} , ATUALIZADO_EM = '${moment.toString()}' WHERE ${TABLE_NAME}.ID = ${message.id}`
				}
			)
		);
	},


	async checkMessageOwnership(messageId, userId) {

		if (!Number(messageId) || !Number(userId)) {
			throw raiseError(
				400,
				"Missing required properties for checking message ownership."
			);
		}

		let results = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT M.CAMINHO_ARQUIVO_AUDIO, M.ORDEM, M.TITULO",
				"FROM PEDIDO P",
				"JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE M.ID = ? AND P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) LIMIT 1;"
			].join(" "),
			[messageId, userId, 'CONCLUIDO']
		);

		console.log(results);

		if (!results || !results.length) {
			throw raiseError(
				403,
				`User ${userId} cannot access message ${messageId}`
			);
		} else {
			return {
				"filePath": results[0].CAMINHO_ARQUIVO_AUDIO,
				"fileName": `${results[0].ORDEM}_${results[0].TITULO}_audio.mp3`
			};
		}

	},

	// @SECTION - Methods for events integration

	/**
	 * Retrieves the count of total Brothers rows.
	 * @method retrieveTotalRowsByEventCount
	 * @return {Promise<Object|Error>} Containing all Brother objects and request metadata.
	 */
	async retrieveTotalRowsByEventCount(eventId) {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				`SELECT COUNT(ID) FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.EVENTO_ID = ?;`,
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
				`WHERE ${TABLE_NAME}.EVENTO_ID = ${Number(eventId)}`,
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
	},

	async guessTheCurrentId() {
		return (await logger.retrieveLatestCreatedIdByReference(TABLE_NAME));
	}



};