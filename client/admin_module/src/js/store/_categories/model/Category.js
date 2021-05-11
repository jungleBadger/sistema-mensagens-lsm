"use strict";

export default class Category {
	constructor (props) {

		this.id = props.ID || props.id;
		this.name = props.NOME || props.name;
		this.createdAt = new Date(props.CRIADO_EM + " UTC") || props.createdAt;

	}

}
