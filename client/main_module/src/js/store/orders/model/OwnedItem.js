"use strict";

export default class OwnedItem {
	constructor (props) {
		this.orderItemId = props.PEDIDO_ITEM_ID || props.orderItemId;
		this.messageId = props.messageId || props.MENSAGEM_ID;
		this.messageTitle = props.messageTitle || props.MENSAGEM_TITULO;
		this.orderId = props.orderId || props.PEDIDO_ID;
		this.audioFilePath = props.audioFilePath || props.CAMINHO_ARQUIVO_AUDIO;
		this.orderStatusId = props.orderStatusId || props.STATUS_ID;
		this.appliedValue = Number(props.appliedValue || props.VALOR_APLICADO).toFixed(2);
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM );
		this.updatedAt = props.updatedAt || new Date(props.ATUALIZADO_EM );
	}

}
