"use strict";

export default class Log {
	constructor (props) {

		this.id = props.ID;
		this.referenceId = props.REFERENCIA_ID;
		this.referenceTable = props.REFERENCIA_TABELA;
		this.action = props.ACAO;
		this.operator = props.OPERADOR_FANTASIA;
		this.operatorId = props.OPERADOR_ID;
		this.createdAt = new Date(props.CRIADO_EM + " UTC");

	}

}
