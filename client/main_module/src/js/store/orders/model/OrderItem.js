"use strict";

export default class OrderItem {
	constructor (props) {
		this.id = props.id || props.ID;
		this.orderStatus = props.orderStatus || props.PEDIDO_STATUS;
		this.totalItems = props.totalItems || props.TOTAL_ITENS;
		this.totalValue = `R$ ${(props.totalValue || props.VALOR_TOTAL).toFixed(2)}`;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM );
		this.updatedAt = props.updatedAt || new Date(props.ATUALIZADO_EM );
	}

}
