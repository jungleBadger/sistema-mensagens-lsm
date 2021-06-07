"use strict";

const express = require("express");
const router = express.Router();
const message = require("../../../helpers/message/publicRetrieval");

router.get(
	"/:messageId",
	async (req, res) => {
		res.status(200).send(
			await message.retrieveById(
				req.params.messageId
			)
		);

	}
);

router.get(
	"/count/:eventId",
	async (req, res) => {
		res.status(200).send(
			await message.retrieveTotalRowsByEventCount(req.params.eventId)
		);
	}
);

router.get(
	"/list/:eventId",
	async (req, res) => {
		res.status(200).send(
			await message.retrieveAllByEventId(
				req.params.eventId,
				[
					"MENSAGEM.ID",
					"MENSAGEM.ORDEM",
					"MENSAGEM.TITULO",
					"MENSAGEM.DATA_MINISTRADO",
					"MENSAGEM.EVENTO_ID",
					"MENSAGEM.IRMAO_ID",
					"MENSAGEM.VALOR",
					"MENSAGEM.CAMINHO_ARQUIVO_AUDIO",
					"MENSAGEM.CAMINHO_ARQUIVO_ESBOCO",
					"MENSAGEM.HABILITADO",
					"MENSAGEM.CRIADO_EM",
					"I.NOME_EXIBICAO AS IRMAO_NOME"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "ASC"
			)
		);
	}
);

module.exports = router;