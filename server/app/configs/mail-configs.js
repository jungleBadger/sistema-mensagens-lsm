"use strict";

module.exports = {
	"service": process.env.EMAIL_SERVICE,
	"host": process.env.EMAIL_HOST,
	"port": process.env.EMAIL_PORT,
	"auth": {
		"user": process.env.EMAIL_USER,
		"pass": process.env.EMAIL_PASSWORD
	}

};
