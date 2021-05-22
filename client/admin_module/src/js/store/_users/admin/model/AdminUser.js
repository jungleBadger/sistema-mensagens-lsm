"use strict";

export default class AdminUser {
	constructor (props) {
		this.id = props.ID || props.id;
		this.email = props.EMAIL || props.email;
		this.displayName = props.NOME_EXIBICAO || props.displayName;
		this.isAdmin = true;
		this.isPasswordRegistered = props.SENHA_REGISTRADA || props.isPasswordRegistered;
		this.isEmailConfirmed = props.EMAIL_CONFIRMADO || props.isEmailConfirmed;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM + " UTC");
		this.updatedAt = props.updatedAt || new Date(props.ATUALIZADO_EM + " UTC");
	}

}
