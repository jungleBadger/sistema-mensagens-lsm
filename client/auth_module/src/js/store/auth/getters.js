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

	isLoginFormValid(context) {
		return context.email && context.password && context.password.length >= 8;
	},

	isSignupFormValid(context) {
		return context.email && context.password && context.password.length >= 8 && context.password === context.confirmPassword;
	}
};