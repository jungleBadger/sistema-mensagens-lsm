"use strict";

export default class Location {
	constructor (props) {
		this.id = props.ID || props.id;
		this.country = props.PAIS || props.country;
		this.state = props.ESTADO || props.state;
		this.city = props.CIDADE || props.city;
		this.description = props.DESCRICAO || props.description;
		this.mnemonic = `${this.country} - ${this.state} - ${this.city}`;
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM + " UTC") ;
	}
}
