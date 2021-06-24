"use strict";

import Message from "./Message";

export default class Event {
	constructor (props) {
		this.id = props.ID || props.id;
		this.categoryId = props.categoryId || props.CATEGORIA_ID;
		this.locationId = props.locationId || props.LOCALIDADE_ID;
		this.title = props.title || props.TITULO;
		this.totalMessages = props.totalMessages || props.TOTAL_MENSAGENS || 0;
		this.messages = props.messages || (props.MENSAGENS || []).map(message => new Message(message));
		this.categoryName = props.categoryName || props.CATEGORIA_NOME;
		if (props.startDate) {
			this.startDate = new Date(props.startDate);
		} else if (props.DATA_INICIO) {
			this.startDate = new Date(props.DATA_INICIO)
			if(Number.isNaN(this.startDate.getMonth())) {
				let arr = props.DATA_INICIO.split(/[- :]/);
				this.startDate = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
			}
		} else {
			this.startDate = "";
		}

		if (props.endDate) {
			this.endDate = new Date(props.endDate);
		} else if (props.DATA_FIM) {
			this.endDate = new Date(props.DATA_FIM)
			if(Number.isNaN(this.endDate.getMonth())) {
				let arr = props.DATA_INICIO.split(/[- :]/);
				this.endDate = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
			}
		} else {
			this.endDate = "";
		}

		this.location = props.location || props.LOCALIDADE;
		this.description = props.description || props.DESCRICAO;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM );

	}

}
