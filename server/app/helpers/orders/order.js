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
const fs = require("fs").promises;
const logger = require("../logger");
const Transaction = require("../../models/yapay/Transaction");
const shoppingCart = require("./shoppingCart");
const db2timestamp = require("../db2Timestamp");
const TABLE_NAME = "PEDIDO";

module.exports = {


	/**
	 * @method setOrderToPending
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async setOrderToPending (orderId, userId) {

		await connectionPool.executePreparedSqlInstruction(
			[
				"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ? AND P.USUARIO_ID = ?"
			].join(" "),
			[db2timestamp(), 'PENDENTE', Number(orderId), Number(userId)]
		);
	},

	/**
	 * @method fetchPendingOrders
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async fetchPendingOrders(userId) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user's pending orders."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
				"GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;"
			].join(" "),
			[userId, 'PENDENTE']
		);

		return result || [];
	},

	/**
	 * @method fetchPendingOrders
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async fetchRejectedOrders(userId) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user's pending orders."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
				"GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;"
			].join(" "),
			[userId, 'REJEITADO']
		);

		return result || [];
	},

	/**
	 * @method fetchProcessedOrders
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async fetchProcessedOrders(userId) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user's pending orders."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
				"GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;"
			].join(" "),
			[userId, 'CONCLUIDO']
		);

		return result || [];
	},

	/**
	 * @method countUserOrders
	 * @return {Promise<Object|Error>}
	 */
	async countUserOrders (userId) {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT(P.ID) FROM ${TABLE_NAME} P`,
					`WHERE P.USUARIO_ID = ? AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)`
				].join(" "),
				[userId, "ABERTO"],
				"fetch"
			))["1"]
		};
	},

	/**
	 * @method fetchUserOrders
	 * @param {string} userId
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>}
	 */
	async fetchUserOrders(userId, limit = 20, skip = 0, orderBy = "CRIADO_EM", orderDirection= "DESC") {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user's pending orders."
			);
		}

		let results = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID, INITCAP(PS.NOME_EXIBICAO) AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS,",
				"SUM(PI.VALOR_APLICADO) AS VALOR_TOTAL",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
				"GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM",
				`ORDER BY ${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
				";"
			].join(" "),
			[userId, 'ABERTO']
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		};
	},

	/**
	 * Search user orders.
	 * @method searchUserOrders
	 * @param {string} userId - Filtering text.
	 * @param {string} filterText - Filtering text.
	 * @param {Array<string>} [extraFilterColumns=[]] - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<object|Error>} TBD.
	 */
	async searchUserOrders(userId, filterText, extraFilterColumns = [], targetColumns = [], limit = 20, skip = 0, orderBy = "P.CRIADO_EM", orderDirection= "DESC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching User orders."
			);
		}

		let [results, countResults] = await Promise.all([
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT P.ID, INITCAP(PS.NOME_EXIBICAO) AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM,`,
					"SUM(PI.VALOR_APLICADO) AS VALOR_TOTAL,",
					"COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS",
					`FROM (
					${TABLE_NAME} P
					FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID
					JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID
					)`,
					"WHERE P.USUARIO_ID = ? AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
					`AND (${extraFilterColumns.map((column) => `LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" OR ")})`,
					`GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM`,
					`ORDER BY ${orderBy} ${orderDirection}`,
					`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
					";"
				].join(" "),
				[Number(userId), 'ABERTO']
			),
			connectionPool.executePreparedSqlInstruction(
				[
					`SELECT COUNT(P.ID)`,
					`FROM (
					${TABLE_NAME} P
					FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID
					JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID
					)`,
					"WHERE P.USUARIO_ID = ? AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)",
					`AND (${extraFilterColumns.map((column) => `LOWER(${column}) LIKE LOWER('%${filterText}%')`).join(" OR ")})`,
					";"
				].join(" "),
				[Number(userId), 'ABERTO'],
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

	async fetchOwnedItems (userId) {
		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user items."
			);
		}

		return await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) LIMIT 1000;"
			].join(" "),
			[userId, 'CONCLUIDO']
		);

	},

	async processOrder(orderId, yapayObject = {}) {

		if (yapayObject.transaction.status_name.toLowerCase() === "aguardando pagamento") {
			await this.setOrderToAnalysis(orderId);
		} else {
			await Promise.all([
				this.storeOrderTransaction({
					"orderId": orderId,
					"transactionId": yapayObject.transaction.transaction_id,
					"transactionToken": yapayObject.token_transaction,
					"transactionDate": yapayObject.transaction.date_transaction
				}),
				fs.writeFile(`./${Date.now()}_request.log`, JSON.stringify({
					yapayObject,
					orderId
				}, null, 4))
			]);

			if (yapayObject.transaction.status_name === "Aprovada") {
				await this.setOrderToApproved(orderId);
			} else {
				await this.setOrderToCancelled(orderId);
			}
		}

	},


	async storeOrderTransaction(params = {}) {
		const transaction = new Transaction(
			params.orderId,
			params.transactionId,
			params.transactionToken,
			params.transactionDate
		);

		const insertKeys = transaction.getKeys();

		try {

			return {
				...(
					await logger.generateLog(
						"CREATE",
						(await connectionPool.executePreparedSqlInstruction(
							[
								`(SELECT ID FROM FINAL TABLE (insert INTO PEDIDO_YAPAY_TRANSACAO (${insertKeys.join(", ")})`,
								`values (${insertKeys.map(() => "?").join(", ")})))`
							].join(" "),
							transaction.getValues(),
							"fetch"
						)).ID,
						"PEDIDO_YAPAY_TRANSACAO",
						"system",
						null
					)
				)
			};


		} catch (e) {
			console.log(e);
			throw e;
		}
	},

	/**
	 * @method validateOrder
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async validateOrder (orderId, userId) {

		await shoppingCart.removeDisabledItems(orderId, userId);
		return await shoppingCart.retrieveUserCart(userId);
	},


	/**
	 * @method setOrderToApproved
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @return {Promise<Object|Error>}
	 */
	async setOrderToApproved (orderId) {

		await connectionPool.executePreparedSqlInstruction(
			[
				"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?"
			].join(" "),
			[db2timestamp(), 'CONCLUIDO', Number(orderId)]
		);
	},

	/**
	 * @method setOrderToApproved
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @return {Promise<Object|Error>}
	 */
	async setOrderToAnalysis (orderId) {

		await connectionPool.executePreparedSqlInstruction(
			[
				"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?"
			].join(" "),
			[db2timestamp(), 'ANALISE', Number(orderId)]
		);
	},


	/**
	 * @method setOrderToApproved
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @return {Promise<Object|Error>}
	 */
	async setOrderToCancelled (orderId) {

		await connectionPool.executePreparedSqlInstruction(
			[
				"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?"
			].join(" "),
			[db2timestamp(), 'REJEITADO', Number(orderId)]
		);
	}

};