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

// 1. Grab PEDIDO from a given USER_ID
// 2a. Pedido OPEN already exists
//    add/remove item
// 2b. Pedido OPEN does not exist
//    create pedido with status OPEN
//    add item*

// check cart - open order already exists?
   //EXISTS
      // add/remove item
//
// const TABLE_NAME = "PEDIDO";
// const PEDIDO_ITEM_TABLE_NAME = "PEDIDO_ITEM";

module.exports = {


	/**
	 * @method addItemToCart
	 * @desc Add product to an OPEN order from a given user.
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async createCart (userId) {

		let doubleCheckOrderStatus = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT ID, CRIADO_EM FROM PEDIDO WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?) AND PEDIDO.USUARIO_ID = ?;"
			].join(" "),
			['ABERTO', Number(userId)]
		);

		if (doubleCheckOrderStatus && doubleCheckOrderStatus[0]) {
			return {
				"ID": doubleCheckOrderStatus[0].ID,
				"CRIADO_EM": doubleCheckOrderStatus[0].CRIADO_EM
			}
		} else {
			let result = await connectionPool.executePreparedSqlInstruction(
				[
					"(SELECT ID, CRIADO_EM FROM FINAL TABLE (INSERT INTO PEDIDO (STATUS_ID, USUARIO_ID)",
					"VALUES((SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?),",
					"?)));"
				].join(" "),
				['ABERTO', Number(userId)]
			);

			if (result && result[0]) {
				return {
					"ID": result[0].ID,
					"CRIADO_EM": result[0].CRIADO_EM
				}
			} else {
				console.log(result);
				throw raiseError(
					500,
					"Problem creating shopping cart."
				);
			}
		}


	},

	/**
	 * @method addItemToCart
	 * @desc Add product to an OPEN order from a given user.
	 * @param {string} itemId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async addItemToCart (itemId, userId) {
		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"(SELECT ID, PEDIDO_ID, VALOR_APLICADO, CRIADO_EM FROM FINAL TABLE (INSERT INTO PEDIDO_ITEM (PEDIDO_ID, MENSAGEM_ID)",
				"VALUES((SELECT ID FROM PEDIDO WHERE PEDIDO.USUARIO_ID = ? AND PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?)),",
				"?)));"
			].join(" "),
			[Number(userId), 'ABERTO', Number(itemId)]
		);

		if (result && result[0]) {
			return {
				"ID": result[0].ID,
				"PEDIDO_ID": result[0].PEDIDO_ID,
				"VALOR_APLICADO": result[0].VALOR_APLICADO,
				"MENSAGEM_ID": itemId,
				"CRIADO_EM": result[0].CRIADO_EM
			}
		} else {
			console.log(result);
			throw raiseError(
				500,
				"Problem adding item to shopping cart."
			);
		}
	},

	/**
	 * @method removeItemFromCart
	 * @desc Remove a given product from an OPEN order from a given user.
	 * @param {string} cartItemId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async removeItemFromCart (cartItemId, userId) {
		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM WHERE PEDIDO_ITEM.ID = ? AND PEDIDO_ITEM.PEDIDO_ID =",
				"(SELECT ID FROM PEDIDO WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?)",
				"AND PEDIDO.USUARIO_ID = ?);"
			].join(" "),
			[Number(cartItemId), 'ABERTO', Number(userId)]
		);
	},

	/**
	 * @method removeDisabledItems
	 * @desc Remove disabled items from a given cart.
	 * @param {string} orderId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async removeDisabledItems (orderId, userId) {

		console.log([
			"DELETE FROM PEDIDO_ITEM PI WHERE MENSAGEM_ID IN (",
			"SELECT M.ID AS MENSAGEM_ID FROM PEDIDO JOIN PEDIDO P on PEDIDO.ID = PI.PEDIDO_ID  JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
			"WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?)",
			"AND PI.PEDIDO_ID = ? AND P.USUARIO_ID = ? AND M.HABILITADO = FALSE",
			");"
		].join(" "));
		console.log(orderId);
		console.log(userId);
		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM PI WHERE MENSAGEM_ID IN (",
					"SELECT M.ID AS MENSAGEM_ID FROM PEDIDO JOIN PEDIDO P on PEDIDO.ID = PI.PEDIDO_ID  JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
					"WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?)",
					"AND PI.PEDIDO_ID = ? AND P.USUARIO_ID = ? AND M.HABILITADO = FALSE",
				");"
			].join(" "),
			['ABERTO', Number(orderId), Number(userId)]
		);
	},

	/**
	 * @method retrieveUserCart
	 * @param {string} userId - ID to search for.
	 * @return {Promise<Object|Error>}
	 */
	async retrieveUserCart (userId) {

		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user shopping cart."
			);
		}
		console.log(	[
			"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM",
			"FROM PEDIDO P",
			"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
			"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
			"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
			"WHERE P.USUARIO_ID = ? AND M.HABILITADO = true",
			"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?);"
		].join(" "));

		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE P.USUARIO_ID = ? AND M.HABILITADO = true",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?);"
			].join(" "),
			[userId, 'ABERTO']
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Shopping cart for user ${userId} not found.`
			);
		} else {
			return result;
		}

	},

	/**
	 * @method clearCart
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async clearCart (userId) {

		if (!userId) {
			throw raiseError(
				400,
				"Missing required properties for fetching user shopping cart."
			);
		}

		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM WHERE PEDIDO_ITEM.PEDIDO_ID =",
				"(SELECT ID FROM PEDIDO WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?)",
				"AND PEDIDO.USUARIO_ID = ?);"
			].join(" "),
			['ABERTO', Number(userId)]
		);

	},

};