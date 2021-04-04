"use strict";

const AES = require("crypto-js/aes");
const encUtf8 = require("crypto-js/enc-utf8");
const ECB = require("crypto-js/mode-ecb");

process.on("message", (data) => {
	try {
		process.send(
			AES.decrypt(
				data.encryptedData,
				data.deterministic ? encUtf8.parse(data.secret) : data.secret,
				{ "mode": ECB }
			).toString(encUtf8)
		);
	} catch (e) {
		process.send(e);
	}

});