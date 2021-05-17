"use strict";

export default class Brother {
	constructor (props) {
		this.id = props.ID || props.id;
		this.displayName = props.NOME_EXIBICAO || props.displayName;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM + " UTC") ;

	}

}
