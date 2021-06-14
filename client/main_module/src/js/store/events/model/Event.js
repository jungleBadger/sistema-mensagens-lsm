"use strict";

export default class Event {
	constructor (props) {
		this.id = props.ID || props.id;
		this.categoryId = props.categoryId || props.CATEGORIA_ID;
		this.locationId = props.locationId || props.LOCALIDADE_ID;
		this.title = props.title || props.TITULO;
		this.totalMessages = props.totalMessages || props.TOTAL_MENSAGENS || 0;
		this.messages = props.messages || [];
		this.categoryName = props.categoryNaem || props.CATEGORIA_NOME;
		if (props.startDate) {
			this.startDate = new Date(props.startDate);
		} else if (props.DATA_FIM) {
			this.startDate = new Date(props.DATA_INICIO );
		} else {
			this.startDate = "";
		}

		if (props.endDate) {
			this.endDate = new Date(props.endDate);
		} else if (props.DATA_FIM) {
			this.endDate = new Date(props.DATA_FIM );
		} else {
			this.endDate = "";
		}

		this.location = props.location || props.LOCALIDADE;
		this.description = props.description || props.DESCRICAO;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM );
	}

}
