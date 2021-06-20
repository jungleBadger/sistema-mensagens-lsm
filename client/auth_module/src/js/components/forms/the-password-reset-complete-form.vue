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
					Redefina sua senha
				</h2>


			</div>


			<lsm-inline-notification
				v-if="requestResetMessage"
				title="Processo iniciado com sucesso:"
				:description="requestResetMessage"
				kind="success">
			</lsm-inline-notification>


			<lsm-inline-notification
				v-if="password && confirmPassword && doesThePasswordHaveMinLength && !doesPasswordMatch"
				title="Problema no campo senha:"
				description="Garanta que senha e confirmação de senha possuem o mesmo valor."
				kind="warning">
			</lsm-inline-notification>

			<lsm-inline-notification
				v-if="completeResetErrorMessage"
				:title="completeResetErrorMessage.title"
				:description="completeResetErrorMessage.description"
				kind="error">
			</lsm-inline-notification>


			<recaptcha-protected-resource>

				<form
					class="mt-8 space-y-6"
					action="#"
					method="POST"
					@submit.prevent="submitRequestResetForm">

					<div class="rounded-md shadow-sm -space-y-px">

						<lsm-input
							:model-value="resetEmail"
							disabled
							readonly
							id="email"
							name="email"
							label="Endereço de email"
							type="email"
							autocomplete="username"
							placeholder="Digite seu endereço de email"
							minlength="4"
							maxlength="256"
							required
						/>

						<lsm-input
							v-model="password"
							autofocus
							class="disabled:opacity-50"
							id="new-password"
							name="password"
							type="password"
							label="Password"
							autocomplete="new-password"
							placeholder="Digite uma senha"
							minlength="8"
							maxlength="128"
							@input="resetForm"
							required />

						<lsm-input
							v-model="confirmPassword"
							class="rounded-b-md disabled:opacity-50"
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


					<div v-if="!requestResetMessage">
						<lsm-button
							type="submit"
							label="Redefinir senha"
							class="w-full"
							:disabled="Boolean(loadingState || !isResetFormValid)"
							icon-id="seal-exclamation"
							:is-loading="loadingState">
						</lsm-button>

					</div>


				</form>
			</recaptcha-protected-resource>

		</div>
	</div>

</template>



<script>

import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button"
import RecaptchaProtectedResource from "../recaptcha-protected-resource";
import LsmInlineNotification from "../../../../../_etc/shared_components/ui/lsm-inline-notification"

// General - Invalid form.
// Basic - Account don't exist
// Basic - Incorrect password
// Google - Account not linked

export default {
	"name": "ThePasswordResetCompleteForm",
	"components": {
		LsmButton,
		LsmInput,
		RecaptchaProtectedResource,
		LsmInlineNotification
	},
	"data": function () {
		return {
			"requestResetMessage": "",
			"resetEmail": "",
			"resetJWT": "",
			"password": "",
			"confirmPassword": ""

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


		"loadingState": {
			get() {
				return this.$store.getters["auth/loadingState"];
			}
		},

		"isResetFormValid": function () {
			return this.resetEmail && this.resetJWT && this.password && this.doesThePasswordHaveMinLength && this.doesPasswordMatch;
		},

		"completeResetErrorMessage": {
			get() {
				return this.$store.getters["auth/completeResetErrorMessage"];
			},
			set(value) {
				this.$store.commit("auth/completeResetErrorMessage", value);
			}
		},

		"doesThePasswordHaveMinLength": function () {
			return this.password.length >= 8;
		},

		"doesPasswordMatch": function () {
			return this.password === this.confirmPassword;
		}
	},
	"methods": {

		async submitRequestResetForm() {

			if (this.isResetFormValid) {
				this.resetForm();
				if (await this.$store.dispatch("auth/completeReset", {
					"email": this.resetEmail,
					"jwt": this.resetJWT,
					"password": this.password
				})) {
					let index = 3;
					this.requestResetMessage = `Redirecionando para a página de login em ${index}.`;
					let intervalHandler = setInterval(async () => {
						if (index) {
							this.requestResetMessage = `Redirecionando para a página de login em ${index}.`;
							index -= 1;
						} else {
							clearInterval(intervalHandler);
							await this.$router.replace({"name": "auth.login"})
						}

					}, 1000);
				}

			}

			// if (await this.$store.dispatch("auth/requestPasswordReset")) {
			// 	this.requestResetMessage = "Cheque sua caixa de entrada.";
			// }
		},

		resetForm() {
			if (this.completeResetErrorMessage) {
				this.completeResetErrorMessage = "";
				this.requestResetMessage = "";
			}
		}
	},
	async beforeMount () {
		let jwt = new URLSearchParams(window.location.search).get("jwt");
		let email = new URLSearchParams(window.location.search).get("email");
		if (!jwt || !email) {
			await this.$router.replace({"name": "auth.login"})
		}

		this.resetJWT = jwt;
		this.resetEmail = email;
	}
}
</script>

<style scoped>

</style>