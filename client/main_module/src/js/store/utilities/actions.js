"use strict";

import userFactory from "../../factory/user";

export default {

	async getUserInfo(context) {
		let result = await userFactory.userInfo();

		context.commit("userInfo", result);

		return result;
	}
};