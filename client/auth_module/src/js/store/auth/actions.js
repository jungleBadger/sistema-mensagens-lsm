"use strict";

import factory from "../../factory/login";

export default {

	async login(context) {

		const { email, password } = context.getters;

		await factory.doLogin(
			email,
			password
		);
	}
};