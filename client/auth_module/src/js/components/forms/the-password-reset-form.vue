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
					Recupere sua senha
				</h2>

				<p class="mt-2 text-center text-sm text-gray-600">
					Ou
					<router-link
						class="font-medium text-blue-700 hover:text-blue-400"
						:to="{'name': 'auth.login'}">Acesse sua conta</router-link>
				</p>

			</div>


			<lsm-inline-notification
				v-if="requestResetMessage"
				title="Processo iniciado com sucesso:"
				:description="requestResetMessage"
				kind="success">
			</lsm-inline-notification>



			<lsm-inline-notification
				v-if="requestResetErrorMessage"
				:title="requestResetErrorMessage.title"
				:description="requestResetErrorMessage.description"
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
							v-model="email"
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
							@input="resetForm"
						/>
					</div>

					<div v-if="!requestResetMessage">
						<lsm-button
							type="submit"
							label="Recuperar senha"
							class="disabled:opacity-50"
							:disabled="Boolean(loadingState || !isRequestResetFormValid)"
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
	"name": "ThePasswordResetForm",
	"components": {
		LsmButton,
		LsmInput,
		RecaptchaProtectedResource,
		LsmInlineNotification
	},
	"data": function () {
		return {
			"requestResetMessage": ""
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

		"isRequestResetFormValid": function () {
			return this.email;
		},

		"requestResetErrorMessage": {
			get() {
				return this.$store.getters["auth/requestResetErrorMessage"];
			},
			set(value) {
				this.$store.commit("auth/requestResetErrorMessage", value);
			}
		}
	},
	"methods": {

		async submitRequestResetForm() {
			if (await this.$store.dispatch("auth/requestPasswordReset")) {
				this.requestResetMessage = "Cheque sua caixa de entrada.";
			}
		},

		resetForm() {
			if (this.requestResetMessage) {
				this.requestResetMessage = "";
			}
		}
	}
}
</script>

<style scoped>

</style>