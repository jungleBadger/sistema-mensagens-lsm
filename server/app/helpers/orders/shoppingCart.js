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

module.exports = {

	async createCart(userId) {
		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"(SELECT ID, CRIADO_EM FROM FINAL TABLE (INSERT INTO PEDIDO (STATUS_ID, USUARIO_ID)",
				"VALUES((SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = 'CONCLUIDO'), ?)));"
			].join(" "),
			[Number(userId)]
		);

		if (result && result[0]) {
			return { ID: result[0].ID, CRIADO_EM: result[0].CRIADO_EM };
		} else {
			throw raiseError(500, "Problem creating shopping cart.");
		}
	},

	async addItemToCart(itemId, userId) {
		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"(SELECT ID, PEDIDO_ID, VALOR_APLICADO, CRIADO_EM FROM FINAL TABLE (",
				"INSERT INTO PEDIDO_ITEM (PEDIDO_ID, MENSAGEM_ID, VALOR_APLICADO) ",
				"VALUES ((SELECT ID FROM PEDIDO WHERE USUARIO_ID = ? AND STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE NOME_EXIBICAO = 'CONCLUIDO')), ?, 0)" ,
				"));"
			].join(" "),
			[Number(userId), Number(itemId)]
		);

		if (result && result[0]) {
			return {
				PEDIDO_ITEM_ID: result[0].ID,
				PEDIDO_ID: result[0].PEDIDO_ID,
				VALOR_APLICADO: 0,
				MENSAGEM_ID: itemId,
				CRIADO_EM: result[0].CRIADO_EM
			};
		} else {
			throw raiseError(500, "Problem adding item to shopping cart.");
		}
	},

	async removeItemFromCart(cartItemId, userId) {
		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM WHERE PEDIDO_ITEM.ID = ? AND PEDIDO_ITEM.PEDIDO_ID =",
				"(SELECT ID FROM PEDIDO WHERE STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE NOME_EXIBICAO = 'CONCLUIDO')",
				"AND USUARIO_ID = ?);"
			].join(" "),
			[Number(cartItemId), Number(userId)]
		);
	},

	async removeDisabledItems(orderId, userId) {
		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM PI WHERE MENSAGEM_ID IN (",
				"SELECT M.ID AS MENSAGEM_ID FROM PEDIDO JOIN PEDIDO P on PEDIDO.ID = PI.PEDIDO_ID  JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"WHERE PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE NOME_EXIBICAO = 'CONCLUIDO')",
				"AND PI.PEDIDO_ID = ? AND P.USUARIO_ID = ? AND M.HABILITADO = FALSE",
				");"
			].join(" "),
			[Number(orderId), Number(userId)]
		);
	},

	async retrieveUserCart(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, E.TITULO AS EVENTO_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM, I.NOME_EXIBICAO AS IRMAO_NOME",
				"FROM PEDIDO P",
				"FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID",
				"JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID",
				"FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID",
				"FULL JOIN IRMAO I on M.IRMAO_ID = I.ID",
				"FULL JOIN EVENTO E on M.EVENTO_ID = E.ID",
				"WHERE P.USUARIO_ID = ? AND M.HABILITADO = true",
				"AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = 'CONCLUIDO');"
			].join(" "),
			[userId]
		);

		if (!result || !result.length) {
			throw raiseError(404, `Shopping cart for user ${userId} not found.`);
		} else {
			return result;
		}
	},

	async clearCart(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		return await connectionPool.executePreparedSqlInstruction(
			[
				"DELETE FROM PEDIDO_ITEM WHERE PEDIDO_ITEM.PEDIDO_ID =",
				"(SELECT ID FROM PEDIDO WHERE STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE NOME_EXIBICAO = 'CONCLUIDO')",
				"AND USUARIO_ID = ?);"
			].join(" "),
			[Number(userId)]
		);
	}
};