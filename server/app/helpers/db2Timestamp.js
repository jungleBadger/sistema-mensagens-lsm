"use strict";

const raiseError = require("./errorHandler").raiseError;
const utc = require("dayjs/plugin/utc");
const dayjs = require("dayjs");
dayjs.extend(utc);

module.exports = function (referenceDate = new Date()) {
	if (!referenceDate) {
		raiseError(
			400,
			"Invalid reference date."
		);
	}
	return dayjs(referenceDate).format("YYYY-MM-DD HH:mm:ss");
}