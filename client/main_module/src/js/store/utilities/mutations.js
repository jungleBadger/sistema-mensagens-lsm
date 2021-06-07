"use strict";

export default {

	userInfo(context, userInfo) {
		context.userInfo = userInfo;
	},

	isSideMenuOpen(context, value = false) {
		context.isSideMenuOpen = value;
	}
}