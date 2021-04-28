"use strict";

const nodemailer = require("nodemailer");
const mailConfigs = require("../configs/mail-configs");

module.exports = nodemailer.createTransport(mailConfigs, {
	"from": '"Sistema de Mensagens LSM" <sistema@lsm.com>', // sender address
});
