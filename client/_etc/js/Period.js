"use strict";

const date = require("dayjs");

module.exports = class Period {
	constructor (mnemonic = "today") {
		let now = date();
		let reference;

		this.mnemonic = mnemonic;
		this.moment = now.toString();

		switch (mnemonic) {
			case "today":
				this.startDate = now.startOf("day").toDate();
				this.endDate = now.endOf("day").toDate();
				break;
			case "last_week":
				reference = now.subtract(1, "week");
				this.startDate = reference.startOf("week").toDate();
				this.endDate = reference.endOf("week").toDate();
				break;
			case "current_week":
				this.startDate = now.startOf("week").toDate();
				this.endDate = now.endOf("week").toDate();
				break;
			case "last_month":
				reference = now.subtract(1, "month");
				this.startDate = reference.startOf("month").toDate();
				this.endDate = reference.endOf("month").toDate();
				break;
			case "current_month":
				this.startDate = now.startOf("month").toDate();
				this.endDate = now.endOf("month").toDate();
				break;
			case "current_year":
				this.startDate = now.startOf("year").toDate();
				this.endDate = now.endOf("year").toDate();
				break;
			default:
				return false;
		}

	}
};