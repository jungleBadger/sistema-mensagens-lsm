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
const logger = require("../logger");
const shoppingCart = require("./shoppingCart");
const db2timestamp = require("../db2Timestamp");
const TABLE_NAME = "PEDIDO";

module.exports = {

	async setOrderToPending(orderId, userId) {
		await connectionPool.executePreparedSqlInstruction(
			"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ? AND P.USUARIO_ID = ?",
			[db2timestamp(), 'PENDENTE', Number(orderId), Number(userId)]
		);
	},

	async fetchPendingOrders(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		let result = await connectionPool.executePreparedSqlInstruction(
			"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS FROM PEDIDO P FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID WHERE P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;",
			[userId, 'PENDENTE']
		);
		return result || [];
	},

	async fetchRejectedOrders(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		let result = await connectionPool.executePreparedSqlInstruction(
			"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS FROM PEDIDO P FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID WHERE P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;",
			[userId, 'REJEITADO']
		);
		return result || [];
	},

	async fetchProcessedOrders(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		let result = await connectionPool.executePreparedSqlInstruction(
			"SELECT P.ID AS PEDIDO_ID, PS.NOME_EXIBICAO AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS FROM PEDIDO P FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID WHERE P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM;",
			[userId, 'CONCLUIDO']
		);
		return result || [];
	},

	async countUserOrders(userId) {
		return {
			table: TABLE_NAME,
			count: (await connectionPool.executePreparedSqlInstruction(
				`SELECT COUNT(P.ID) FROM ${TABLE_NAME} P WHERE P.USUARIO_ID = ? AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?)`,
				[userId, "ABERTO"],
				"fetch"
			))["1"]
		};
	},

	async fetchUserOrders(userId, limit = 20, skip = 0, orderBy = "CRIADO_EM", orderDirection= "DESC") {
		if (!userId) throw raiseError(400, "Missing required properties.");
		let results = await connectionPool.executePreparedSqlInstruction(
			`SELECT P.ID, INITCAP(PS.NOME_EXIBICAO) AS PEDIDO_STATUS, P.CRIADO_EM, P.ATUALIZADO_EM, COUNT(PI.MENSAGEM_ID) AS TOTAL_ITENS, SUM(PI.VALOR_APLICADO) AS VALOR_TOTAL FROM PEDIDO P FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID JOIN PEDIDO_STATUS PS on PS.ID = P.STATUS_ID WHERE P.USUARIO_ID = ? AND P.STATUS_ID != (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) GROUP BY P.ID, PS.NOME_EXIBICAO, P.CRIADO_EM, P.ATUALIZADO_EM ORDER BY ${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`,
			[userId, 'ABERTO']
		);
		return { offset: skip + results.length, orderBy, results };
	},

	async fetchOwnedItems(userId) {
		if (!userId) throw raiseError(400, "Missing required properties.");
		return await connectionPool.executePreparedSqlInstruction(
			"SELECT P.ID AS PEDIDO_ID, PI.ID AS PEDIDO_ITEM_ID, PI.MENSAGEM_ID, M.TITULO AS MENSAGEM_TITULO, PI.VALOR_APLICADO, PI.CRIADO_EM FROM PEDIDO P FULL JOIN PEDIDO_ITEM PI on P.ID = PI.PEDIDO_ID FULL JOIN MENSAGEM M on PI.MENSAGEM_ID = M.ID WHERE P.USUARIO_ID = ? AND P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) LIMIT 1000;",
			[userId, 'CONCLUIDO']
		);
	},

	async validateOrder(orderId, userId) {
		await shoppingCart.removeDisabledItems(orderId, userId);
		return await shoppingCart.retrieveUserCart(userId);
	},

	async setOrderToApproved(orderId) {
		await connectionPool.executePreparedSqlInstruction(
			"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?",
			[db2timestamp(), 'CONCLUIDO', Number(orderId)]
		);
	},

	async setOrderToAnalysis(orderId) {
		await connectionPool.executePreparedSqlInstruction(
			"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?",
			[db2timestamp(), 'ANALISE', Number(orderId)]
		);
	},

	async setOrderToCancelled(orderId) {
		await connectionPool.executePreparedSqlInstruction(
			"UPDATE PEDIDO P SET P.ATUALIZADO_EM = ?, P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ?",
			[db2timestamp(), 'REJEITADO', Number(orderId)]
		);
	}

};