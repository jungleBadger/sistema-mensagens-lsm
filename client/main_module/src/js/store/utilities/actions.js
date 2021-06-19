"use strict";

import userFactory from "../../factory/user";

export default {

	async getUserInfo(context) {
		let result = await userFactory.userInfo();

		context.commit("userInfo", result);

		return result;
	},

	"acknowledgeLoginMessage": function (context) {
		window.localStorage.setItem("acknowledgeLoginMessage", "yes");
		context.commit("acknowledgeLoginMessage");
	},

	"acknowledgeRuleMessage": function (context) {
		window.localStorage.setItem("acknowledgeRuleMessage", "yes");
		context.commit("acknowledgeRuleMessage");
	}
};