"use strict";

export default {

	email(context) {
		return context.email;
	},

	password(context) {
		return context.password;
	},

	confirmPassword(context) {
		return context.confirmPassword;
	},

	shouldRememberUserEmail(context) {
		return context.shouldRememberUserEmail;
	},

	loadingState(context) {
		return context.isAppLoading;
	},

	gCaptchaLatestTs(context) {
		return context.gCaptchaLatestTs;
	},

	loginErrorMessage(context) {
		return context.loginErrorMessage;
	},

	signupErrorMessage(context) {
		return context.signupErrorMessage;
	},

	requestResetErrorMessage(context) {
		return context.requestResetErrorMessage;
	}
};