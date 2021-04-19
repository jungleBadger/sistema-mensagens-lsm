"use strict";

export default {

	email(context, value) {
		context.email = value;
	},

	password(context, value) {
		context.password = value;
	},

	confirmPassword(context, value) {
		context.confirmPassword = value;
	}
}