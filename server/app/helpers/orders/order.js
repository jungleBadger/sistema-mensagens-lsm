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
				"UPDATE PEDIDO P SET P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ? AND P.USUARIO_ID = ?"
			].join(" "),
			['PENDENTE', Number(orderId), Number(userId)]
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
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM, M.HABILITADO",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?);"
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
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM, M.HABILITADO",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE P.USUARIO_ID = ?",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?);"
			].join(" "),
			[userId, 'REJEITADO']
		);

		return result || [];
	},

	async processOrder(orderId, yapayObject = {}) {

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
	 * @method setOrderToPending
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
				"UPDATE PEDIDO P SET P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?"
			].join(" "),
			['CONCLUIDO', Number(orderId)]
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
				"UPDATE PEDIDO P SET P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?"
			].join(" "),
			['REJEITADO', Number(orderId)]
		);
	}

};