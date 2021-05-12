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
					Acesse sua conta
				</h2>

				<p class="mt-2 text-center text-sm text-gray-600">
					Ou
					<router-link
						class="font-medium text-blue-700 hover:text-blue-400"
						:to="{'name': 'auth.signup'}">Crie uma nova</router-link>
				</p>

			</div>

			<lsm-inline-notification
				v-if="userCreatedMessage"
				title="Login realizado com sucesso:"
				:description="userCreatedMessage"
				kind="success">
			</lsm-inline-notification>

			<lsm-inline-notification
				v-if="loginErrorMessage"
				:title="loginErrorMessage.title"
				:description="loginErrorMessage.description"
				kind="error">
			</lsm-inline-notification>


			<recaptcha-protected-resource>

				<form
					class="mt-8 space-y-6"
					action="#"
					method="POST"
					@submit.prevent="submitForm">


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
							:key="loginErrorMessage" />

						<lsm-input
							v-model="password"
							class="rounded-b-md disabled:opacity-50"
							:disabled="Boolean(userCreatedMessage)"
							id="current-password"
							name="password"
							type="password"
							label="Password"
							autocomplete="current-password"
							placeholder="Digite sua senha"
							minlength="8"
							maxlength="128"
							required
						/>

					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center cursor-pointer">
							<input
								id="remember_me"
								name="remember_me"
								type="checkbox"
								v-model="shouldRememberUserEmail"
								class="cursor-pointer h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
							<label
								for="remember_me"
								class="cursor-pointer ml-2 block text-sm text-gray-900">
								Lembre meu e-mail
							</label>
						</div>

						<div class="text-sm">
							<router-link
								:to="{'name': 'auth.reset'}"
								class="font-medium text-blue-700 hover:text-blue-400">
								Esqueceu sua senha?
							</router-link>
						</div>
					</div>



					<div>
						<lsm-button
							type="submit"
							label="Acessar conta"
							class="w-full"
							:disabled="Boolean(loadingState || userCreatedMessage || !isLoginFormValid)"
							icon-id="lock"
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
					href="/auth/google?action=signin"
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
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";
import RecaptchaProtectedResource from "../recaptcha-protected-resource";
import LsmInlineNotification from "../../../../../_etc/shared_components/ui/lsm-inline-notification"

// General - Invalid form.
// Basic - Account don't exist
// Basic - Incorrect password
// Google - Account not linked

export default {
	"name": "TheLoginForm",
	"components": {
		LsmInlineNotification,
		RecaptchaProtectedResource,
		LsmButton,
		LsmInput
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

		"shouldRememberUserEmail": {
			get() {
				return this.$store.getters["auth/shouldRememberUserEmail"];
			},
			set(value) {
				this.$store.commit("auth/shouldRememberUserEmail", value);
			}
		},

		"loadingState": {
			get() {
				return this.$store.getters["auth/loadingState"];
			}
		},

		"isLoginFormValid": function () {
			return this.email && this.password && this.password.length >= 8;
		},

		"loginErrorMessage": {
			get() {
				return this.$store.getters["auth/loginErrorMessage"];
			},
			set(value) {
				this.$store.commit("auth/loginErrorMessage", value);
			}
		}

	},
	"methods": {

		async submitForm() {

			if (this.isLoginFormValid) {
				this.loginErrorMessage = "";
				let hasRedirectPath = await this.$store.dispatch("auth/login");
				if (hasRedirectPath) {
					this.triggerAutomatedLogin(hasRedirectPath);
				}
			}

		},

		triggerAutomatedLogin(redirectPath = "/") {
			let index = 3;
			this.userCreatedMessage = `Redirecionando para a página principal em ${index}.`;
			let intervalHandler = setInterval(async () => {
				if (index) {
					this.userCreatedMessage = `Redirecionando para a página principal em ${index}.`;
					index -= 1;
				} else {
					clearInterval(intervalHandler);
					location.assign(redirectPath);
				}

			}, 1000);
		}

	},

	mounted () {
		let errorStatus = Number(new URLSearchParams(window.location.search).get("status") || 0);

		if (errorStatus === 404) {

			this.loginErrorMessage = {
				"title": "Houve um problema no seu login com Google:",
				"description": "Seu e-mail não foi encontrado em nossos registros."
			}

		} else if (errorStatus === 409) {

			this.loginErrorMessage = {
				"title": "Já existe uma conta cadastrada com este e-mail!",
				"description": "Faça o login abaixo."
			}

		}  else if (errorStatus) {


			console.log(errorStatus);
			this.loginErrorMessage = {
				"title": "Houve um problema inesperado no seu login com Google!",
				"description": "Tente novamente em alguns minutos."
			}


		}

	}
}
</script>

<style scoped>

</style>