"use strict";

export default class OrderItem {
	constructor (props) {
		this.id = props.ID || props.id;
		this.messageId = props.messageId || props.MENSAGEM_ID;
		this.orderId = props.orderId || props.PEDIDO_ID;
		this.orderStatusId = props.orderStatusId || props.STATUS_ID;
		this.appliedValue = Number(props.appliedValue || props.VALOR_APLICADO).toFixed(2);
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM );
		this.updatedAt = props.updatedAt || new Date(props.ATUALIZADO_EM );
	}

}
