"use strict";

const nodemailer = require("nodemailer");
const mailConfigs = require("../configs/mail-configs");

module.exports = nodemailer.createTransport(mailConfigs, {
	"from": 'lsmadmin@igrejaemsumare.com.br', // sender address
});
