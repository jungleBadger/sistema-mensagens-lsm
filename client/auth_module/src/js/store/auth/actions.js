"use strict";

import recaptcha from "../../factory/recaptcha";
import login from "../../factory/login";
import signup from "../../factory/signup";
import reset from "../../factory/reset";



export default {

	checkCaptchaLatestTs(context) {
		let latestTs = window.localStorage.getItem("g-captcha-challenge-ts");
		if (latestTs) {
			context.commit("gCaptchaLatestTs", latestTs);
		}
	},

	async verifyCaptcha(context, recaptchaData) {
		let challengeResult = await recaptcha.verifyCaptcha(
			recaptchaData
		);

		if (challengeResult && challengeResult.success) {


			window.localStorage.setItem("g-captcha-challenge-ts", challengeResult.challenge_ts);
			context.commit("gCaptchaLatestTs", challengeResult.challenge_ts);

		}

		return challengeResult;
	},

	async login(context) {

		const { email, password } = context.getters;
		context.commit("loadingState", true);
		try {
			let result = await login.doLogin(
				email,
				password
			);
			await context.dispatch("storeEmailLocally");
			return result?.redirectPath;
		} catch (e) {
			if (e.status === 401) {
				context.commit("loginErrorMessage", {
					"title": "Erro ao entrar:",
					"description": "Credenciais inválidas."
				});
			} else {
				console.log(e);
				context.commit("loginErrorMessage", {
					"title": "Erro ao entrar.",
					"description": "Atualize a página e confira os dados."
				});
			}
		} finally {
			context.commit("loadingState", false);
		}
	},

	async signup(context) {
		const { email, password } = context.getters;

		context.commit("loadingState", true);

		try {
			await signup.doSignup(
				email,
				password
			);

			return true;

		} catch (e) {
			if (e.status === 409) {
				context.commit("signupErrorMessage", {
					"title": "Erro ao criar usuário:",
					"description": "Usuário com esse e-mail já existe."
				});
			} else {
				console.log(e);
				context.commit("signupErrorMessage", {
					"title": "Erro ao adicionar usuário.",
					"description": "Atualize a página e confira os dados."
				});
			}

		} finally {
			context.commit("loadingState", false);
		}
	},


	async storeEmailLocally(context) {
		if (context.getters.email) {
			window.localStorage.setItem("stored-email", window.btoa(context.getters.email));
			context.commit("shouldRememberUserEmail", true);
		}
		return true;
	},

	async removeStoredEmail(context) {
		window.localStorage.removeItem("stored-email");
		context.commit("shouldRememberUserEmail", false);
		return true;
	},

	async retrieveStoredEmail(context) {
		let email = window.localStorage.getItem("stored-email");

		if (email) {
			context.commit("email", window.atob(email));
			context.commit("shouldRememberUserEmail", true);

		}

		return true;
	},


	//@TODO split store into smaller modules

	async requestPasswordReset(context) {
		const { email } = context.getters;

		context.commit("loadingState", true);

		try {
			await reset.requestPasswordReset(
				email
			);

			return true;

		} catch (e) {
			if (e.status === 404) {
				context.commit("requestResetErrorMessage", {
					"title": "Erro ao recuperar senha:",
					"description": "Usuário não encontrado."
				});
			} else {
				console.log(e);
				context.commit("requestResetErrorMessage", {
					"title": "Erro ao recuperar senha:",
					"description": "Atualize a página e confira os dados."
				});
			}

		} finally {
			context.commit("loadingState", false);
		}
	}
};