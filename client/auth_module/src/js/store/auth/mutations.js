"use strict";

export default {

	email(context, value = "") {
		context.email = value;
	},

	password(context, value = "") {
		context.password = value;
	},

	confirmPassword(context, value = "") {
		context.confirmPassword = value;
	},


	shouldRememberUserEmail(context, value = false) {
		context.shouldRememberUserEmail = value;
	},

	loadingState(context, value = false) {
		context.isAppLoading = value;
	},

	gCaptchaLatestTs(context, value) {
		context.gCaptchaLatestTs = value;
	},

	loginErrorMessage(context, msg) {
		context.loginErrorMessage = msg;
	},

	signupErrorMessage(context, msg) {
		context.signupErrorMessage = msg;
	},

	requestResetErrorMessage(context, msg) {
		context.requestResetErrorMessage = msg;
	}
}