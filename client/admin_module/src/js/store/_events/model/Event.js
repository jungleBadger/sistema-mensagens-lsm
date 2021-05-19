"use strict";

export default class Event {
	constructor (props) {
		this.id = props.ID || props.id;
		this.title = props.title || props.TITULO;
		this.startDate = props.startDate || (props.DATA_INICIO ? new Date(props.DATA_INICIO + " UTC") : "");
		this.endDate = props.endDate || (props.DATA_FIM ? new Date(props.DATA_FIM + " UTC") : "");
		this.location = props.location || props.LOCALIDADE;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM + " UTC");

	}

}
