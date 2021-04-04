"use strict";

const AES = require("crypto-js/aes");
const ECB = require("crypto-js/mode-ecb");
const encUtf8 = require("crypto-js/enc-utf8");

process.on("message", (data) => {
	try {
		process.send(
			AES.encrypt(
				data.rawData,
				data.deterministic ? encUtf8.parse(data.secret) : data.secret,
				{ "mode": ECB }
			).toString()
		);
	} catch (e) {
		process.send(e);
	}
});