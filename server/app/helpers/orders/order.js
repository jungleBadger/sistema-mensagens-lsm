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


	/**
	 * @method setOrderToPending
	 * @desc Set an open order to pending status.
	 * @param {string} orderId
	 * @param {string} userId
	 * @return {Promise<Object|Error>}
	 */
	async setOrderToPending (orderId, userId) {

		let doubleCheckOrderStatus = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT ID, CRIADO_EM FROM PEDIDO WHERE PEDIDO.ID = ? AND PEDIDO.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS WHERE PEDIDO_STATUS.NOME_EXIBICAO = ?) AND PEDIDO.USUARIO_ID = ?;"
			].join(" "),
			[Number(orderId), 'ABERTO', Number(userId)]
		);

		if (doubleCheckOrderStatus && doubleCheckOrderStatus[0]) {
			await connectionPool.executePreparedSqlInstruction(
				[
					"UPDATE PEDIDO P SET P.STATUS_ID = (SELECT ID FROM PEDIDO_STATUS PS WHERE PS.NOME_EXIBICAO = ?) WHERE P.ID = ? AND P.USUARIO_ID = ?"
				].join(" "),
				['PENDENTE', Number(orderId), Number(userId)]
			);
			return orderId;
		} else {
			throw raiseError(
				404,
				"Order not found."
			);
		}

	}

};