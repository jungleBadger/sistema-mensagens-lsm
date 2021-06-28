"use strict";

export default class Message {
	constructor (props) {
		this.id = props.ID || props.id;
		this.order = props.order || props.ORDEM;
		this.title = props.title || props.TITULO;
		this.brotherId = props.brotherId || props.IRMAO_ID;
		this.brotherName = props.brotherName || props.IRMAO_NOME;
		this.eventId = props.eventId || props.EVENTO_ID;
		this.audioFilePath = props.audioFilePath || props.CAMINHO_ARQUIVO_AUDIO;
		this.pdfFilePath = props.pdfFilePath || props.CAMINHO_ARQUIVO_ESBOCO;
		this.isEnabled = props.isEnabled || props.HABILITADO;

		if (props.DATA_MINISTRADO) {
			this.messageDate = new Date(props.DATA_MINISTRADO)
			if (Number.isNaN(this.messageDate.getMonth())) {
				let arr = props.DATA_MINISTRADO.split(/[- :]/);
				this.messageDate = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
			}
		} else {
			this.messageDate = new Date(props.messageDate);

		}

		this.messageValue = props.messageValue || (props.VALOR || 0).toFixed(2);
		this.createdAt = props.createdAt || new Date(props.CRIADO_EM);
		this.messages = [];
	}

}
