"use strict";

const express = require("express");
const router = express.Router();
const message = require("../../../helpers/message/crud");
const {
	isAdmin
} = require("../../middlewares/auth");

const multer = require("multer");
const { raiseError } = require("../../../helpers/errorHandler");
const { handleExpressError } = require("../../../helpers/errorHandler");
const fs = require("fs").promises;

const upload = multer(
	{
		fileFilter (req, file, cb) {
			if (file && (file.mimetype === "application/pdf" || file.mimetype.indexOf("audio") > -1)) {
				return cb(null, true);
			} else {
				return cb(
					raiseError(
						400,
						`Invalid file type ${file.mimetype}`
					)
				);
			}

		},
		"storage": multer.diskStorage({
			destination: async (req, file, cb) => {

				if (Number(req.body.eventId) !== Number(req.query.eventId)) {
					return cb(
						raiseError(
							400,
							`Invalid event ID configuration`
						)
					);
				}

				let guessedID = `${req.locals.referenceTimestamp}_${((await message.guessTheCurrentId()) + (req.method === "PATCH" ? 0 : 1))}`;
				const initialPath = `uploads/${new Date(req.locals.referenceTimestamp).getFullYear()}/eventos/${req.query.eventId}/mensagens/${guessedID}`;
				let completePath = file.originalname.indexOf(".pdf") > -1 ? `${initialPath}/esbocos` : `${initialPath}/audios`;
				try {
					// Check if folder exists
					await fs.stat(completePath);
				} catch (e) {
					// If folder does not exist, create it
					await fs.mkdir(completePath, { "recursive": true });
				}

				return cb(null, completePath);
			},
			filename: (req, file, cb) => {
				return cb(null, file.originalname);
			}
		})
	}
);

/**
 * @swagger
 * /api/message:
 *   post:
 *     tags: [message]
 *     summary: Create a new Message.
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Message object created.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */

router.post(
	"/",
	isAdmin,
	(req, res, next) => {
		req.locals = {};
		req.locals.referenceTimestamp = Date.now();
		return next();
	},
	(req, res, next) => {
		upload.fields(
			[
				{
					"name": "message_audio",
					"maxCount": 1
				},
				{
					"name": "message_pdf",
					"maxCount": 1
				}
			]
		)(req, res, (err) => {
			if (err) {
				return handleExpressError(err, res);
			}
			res.locals.messageAudioFilePath = req.body.audioFilePath || (req.files && req.files.message_audio && req.files.message_audio[0] ? `${req.files.message_audio[0].destination}/${req.files.message_audio[0].originalname}` : "");
			res.locals.messagePDFFilePath = req.body.pdfFilePath || (req.files && req.files.message_pdf && req.files.message_pdf[0] ? `${req.files.message_pdf[0].destination}/${req.files.message_pdf[0].originalname}` : "");
			next();
		});
	},
	async (req, res) => {

		res.status(
			201
		).send(
			await message.create(
				{
					...req.body,
					"eventId": req.query.eventId,
					"audioFilePath": res.locals.messageAudioFilePath,
					"pdfFilePath": res.locals.messagePDFFilePath
				},
				req.user
			)
		);
	}
);

//
// @SECTION - STANDALONE MESSAGE ENDPOINTS
//

router.get(
	"/count",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await message.retrieveTotalRowsCount()
		);
	}
);

/**
 * @swagger
 * /api/message/search:
 *   delete:
 *     tags: [message]
 *     summary: Search brothers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       500:
 *         description: Error handler.
 */
router.get(
	"/search",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await message.search(
				req.query.filterText,
				req.query.filterColumn || "TITULO",
				req.query.extraFilterColumns ? req.query.extraFilterColumns.split(",") : [],
				req.query.targetColumns ? req.query.targetColumns.split(",") : [
					"ID",
					"TITULO",
					"CRIADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "DESC"
			)
		);
	}
);

router.get(
	"/",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await message.retrieveAll(
				[
					"ID",
					"TITULO",
					"CRIADO_EM"
				],
				Number(req.query.limit) || 20,
				Number(req.query.skip) || 0,
				req.query.orderBy || "ID",
				req.query.orderDirection || "ASC"
			)
		);
	}
);

router.get(
	"/:messageId",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await message.retrieveById(
				req.params.messageId
			)
		);

	}
);

/**
 * @swagger
 * /api/message/:messageId:
 *   patch:
 *     tags: [message]
 *     summary: Updates a given message.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: displayName
 *        in: body
 *        required: true
 *        description: Message's display name.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Message object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Message not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.patch(
	"/:messageId",
	isAdmin,
	(req, res, next) => {
		req.locals = {};
		req.locals.referenceTimestamp = Date.now();
		return next();
	},
	(req, res, next) => {
		upload.fields(
			[
				{
					"name": "message_audio",
					"maxCount": 1
				},
				{
					"name": "message_pdf",
					"maxCount": 1
				}
			]
		)(req, res, (err) => {
			if (err) {
				return handleExpressError(err, res);
			}
			res.locals.messageAudioFilePath = req.body.audioFilePath || (req.files && req.files.message_audio && req.files.message_audio[0] ? `${req.files.message_audio[0].destination}/${req.files.message_audio[0].originalname}` : "");
			res.locals.messagePDFFilePath = req.body.pdfFilePath || (req.files && req.files.message_pdf && req.files.message_pdf[0] ? `${req.files.message_pdf[0].destination}/${req.files.message_pdf[0].originalname}` : "");
			next();
		});
	},
	async (req, res) => {
		res.status(
			200
		).send(
			await message.update(
				req.params.messageId,
				{
					...req.body,
					"eventId": req.query.eventId,
					"audioFilePath": res.locals.messageAudioFilePath,
					"pdfFilePath": res.locals.messagePDFFilePath
				},
				req.user
			)
		);
	}
);

/**
 * @swagger
 * /api/message/:messageId:
 *   delete:
 *     tags: [message]
 *     summary: Deletes a given message.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message object updated.
 *       400:
 *         description: Request parameter issues.
 *       401:
 *         description: Requester not logged in.
 *       403:
 *         description: Requester is not an admin User.
 *       404:
 *         description: Message not found.
 *       409:
 *         description: Display name already exists.
 *       500:
 *         description: Error handler.
 */
router.delete(
	"/:messageId",
	isAdmin,
	async (req, res) => {
		res.status(
			200
		).send(
			await message.delete(
				req.params.messageId,
				req.user
			)
		);
	}
);

//
// @SECTION - EVENT MESSAGE ENDPOINTS
//

router.get(
	"/count/:eventId",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await message.retrieveTotalRowsByEventCount(req.params.eventId)
		);
	}
);

router.get("/test/x", async (req, res) => {
	return res.download(req.query.filePath);
});

router.patch("/organize/:eventId", async (req, res) => {
	return res.status(200).send(await message.organizeMessages(req.body.messages));
});

router.get(
	"/list/:eventId",
	isAdmin,
	async (req, res) => {
		res.status(200).send(
			await message.retrieveAllByEventId(
				req.params.eventId,
				[
					"ID",
					"ORDEM",
					"TITULO",
					"DATA_MINISTRADO",
					"EVENTO_ID",
					"IRMAO_ID",
					"VALOR",
					"CAMINHO_ARQUIVO_AUDIO",
					"CAMINHO_ARQUIVO_ESBOCO",
					"HABILITADO",
					"CRIADO_EM",
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