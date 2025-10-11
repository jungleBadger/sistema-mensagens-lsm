"use strict";

const nodemailer = require("nodemailer");
const mailConfigs = require("../configs/mail-configs");

module.exports = nodemailer.createTransport(mailConfigs, {
	"from": process.env.MAIL_SENDER_ADDRESS || 'lsmadmin@restauradosabiblia.com.br', // sender address
});
