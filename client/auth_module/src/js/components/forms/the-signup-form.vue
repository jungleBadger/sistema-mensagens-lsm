

<template>
	<div class="min-h-screen flex items-center justify-center bg-secondary-brand-color py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8 bg-white shadow rounded-md px-8 py-8 mb-4 ml-auto mr-auto">

			<div>

				<a
					href="/"
					target="_blank">
					<img
						class="mx-auto h-36 w-48 w-auto"
						src="/_etc/assets/1x/logo.png"
						alt="Logotipo Livro aberto"
						role="img"
					/>
				</a>

				<h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
					Crie uma nova conta
				</h2>

				<p class="mt-2 text-center text-sm text-gray-600">
					Ou
					<router-link
						class="font-medium text-blue-700 hover:text-blue-400"
						:to="{'name': 'auth.login'}">Acesse uma já existente</router-link>
				</p>

			</div>

			<lsm-inline-notification
				v-if="userCreatedMessage"
				title="Usuário criado com sucesso"
				:description="userCreatedMessage"
				kind="success">
			</lsm-inline-notification>

			<lsm-inline-notification
				v-if="signupErrorMessage"
				:title="signupErrorMessage.title"
				:description="signupErrorMessage.description"
				kind="error">
			</lsm-inline-notification>

			<lsm-inline-notification
				v-if="password && confirmPassword && doesThePasswordHaveMinLength && !doesPasswordMatch"
				title="Problema no campo senha:"
				description="Garanta que senha e confirmação de senha possuem o mesmo valor."
				kind="warning">
			</lsm-inline-notification>

			<recaptcha-protected-resource>
				<form
					class="mt-8 space-y-6"
					action="#"
					method="POST"
					@submit.prevent="submitSignupForm">

					<div class="rounded-md shadow-sm -space-y-px">

						<lsm-input
							v-model="email"
							class="rounded-t-md disabled:opacity-50"
							:disabled="Boolean(userCreatedMessage)"
							id="email"
							name="email"
							label="Endereço de email"
							type="email"
							autocomplete="username"
							placeholder="Digite seu endereço de email"
							minlength="4"
							maxlength="256"
							required
							autofocus
							:key="signupErrorMessage"/>

						<lsm-input
							v-model="password"
							class="disabled:opacity-50"
							:disabled="Boolean(userCreatedMessage)"
							id="new-password"
							name="password"
							type="password"
							label="Password"
							autocomplete="new-password"
							placeholder="Digite uma senha"
							minlength="8"
							maxlength="128"
							required />

						<lsm-input
							v-model="confirmPassword"
							class="rounded-b-md disabled:opacity-50"
							:disabled="Boolean(userCreatedMessage)"
							id="confirm-password"
							name="new-password"
							type="password"
							label="Password"
							autocomplete="new-password"
							placeholder="Digite a confirmação da senha"
							minlength="8"
							maxlength="128"
							required />
					</div>

					<div>

						<lsm-button
							type="submit"
							label="Criar conta"
							class="w-full"
							:disabled="Boolean(loadingState || userCreatedMessage || !isSignupFormValid)"
							icon-id="user-plus"
							:is-loading="loadingState">
						</lsm-button>

					</div>
				</form>
			</recaptcha-protected-resource>

			<div class="grid sm:grid-cols-3 gap-0 mb-6">
				<hr class="mt-3 hidden sm:block border-gray-400">
				<span class="text-center bg-white text-sm text-gray-700 font-normal">Ou continue com</span>
				<hr class="mt-3 hidden sm:block border-gray-400">
			</div>
			<div>
				<a
					:disabled="loadingState"
					type="button"
					href="/auth/google?action=signup"
					id="google-login-button"
					title="Clique para acessar sua conta através do Google"
					class="relative border-solid border shadow-sm border-gray-400
                        font-semibold text-gray-600 text-sm py-2 text-center rounded text-center w-full
                        focus:outline-none hover:border-indigo-600">
					<font-awesome-icon
						style="line-height: 28px;"
						:icon="['fab', 'google']" />
				</a>
			</div>
		</div>
	</div>

</template>



<script>

import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button"
import RecaptchaProtectedResource from "../recaptcha-protected-resource";
import LsmInlineNotification from "../../../../../_etc/shared_components/ui/lsm-inline-notification"


// General - Invalid form.
// Basic - Account already exists.
// Google - Account already exists - but not linked.
// Google - Account already exists - and it is linked

export default {
	"name": "TheSignupForm",
	"components": {
		LsmButton,
		LsmInput,
		RecaptchaProtectedResource,
		LsmInlineNotification
	},
	"data": function () {
		return {
			"userCreatedMessage": ""
		}
	},
	"computed": {

		"email": {
			get() {
				return this.$store.getters["auth/email"];
			},
			set(value) {
				this.$store.commit("auth/email", value);
			}
		},

		"password": {
			get() {
				return this.$store.getters["auth/password"];
			},
			set(value) {
				this.$store.commit("auth/password", value);
			}
		},

		"confirmPassword": {
			get() {
				return this.$store.getters["auth/confirmPassword"];
			},
			set(value) {
				this.$store.commit("auth/confirmPassword", value);
			}
		},

		"doesThePasswordHaveMinLength": function () {
			return this.password.length >= 8;
		},

		"doesPasswordMatch": function () {
			return this.password === this.confirmPassword;
		},

		"loadingState": {
			get() {
				return this.$store.getters["auth/loadingState"];
			}
		},

		"isSignupFormValid": function () {
			return this.email && this.password && this.doesThePasswordHaveMinLength && this.doesPasswordMatch;
		},

		"signupErrorMessage": {
			get() {
				return this.$store.getters["auth/signupErrorMessage"];
			},
			set(value) {
				this.$store.commit("auth/signupErrorMessage", value);
			}
		}

	},
	"methods": {

		async submitSignupForm() {

			if (this.isSignupFormValid) {
				this.signupErrorMessage = "";
				if (await this.$store.dispatch("auth/signup")) {
					this.triggerAutomatedLogin();
				}
			}
		},

		triggerAutomatedLogin() {
			let index = 5;
			this.userCreatedMessage = `Redirecionando para a página principal em ${index}.`;
			let intervalHandler = setInterval(async () => {
				if (index) {
					this.userCreatedMessage = `Redirecionando para a página principal em ${index}.`;
					index -= 1;
				} else {
					let redirectPath = await this.$store.dispatch("auth/login");
					clearInterval(intervalHandler);
					location.assign(redirectPath);
				}

			}, 1000);
		}
	},

	mounted () {
		let errorStatus = Number(new URLSearchParams(window.location.search).get("status") || 0);


		if (errorStatus === 409) {

			this.signupErrorMessage = {
				"title": "Houve um problema no seu registro de conta usando o Google:",
				"description": "Já existe uma conta cadastrada com este e-mail."
			}

		} else if (errorStatus) {

			console.log(errorStatus);
			this.signupErrorMessage = {
				"title": "Houve um problema inesperado no seu registro de conta usando o Google!",
				"description": "Tente novamente em alguns minutos."
			}


		}

	}

}
</script>

<style scoped>

</style>