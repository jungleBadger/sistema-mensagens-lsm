<template>
	<div class="min-h-screen flex items-center justify-center bg-secondary-brand-color py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8 bg-white shadow rounded-md px-8 py-8 mb-4 ml-auto mr-auto">

			<div>

				<a
					href="/"
					target="_blank">
					<img
						alt="Logotipo Livro aberto"
						class="mx-auto h-36 w-48 w-auto"
						role="img"
						src="/_etc/assets/1x/logo.png"
					/>
				</a>

				<nav class="flex w-full shadow-sm h-12 border mt-2">
					<div class="flex-1 h-full flex items-center justify-center text-gray-800 font-semibold">Entrar</div>
					<div class="cursor-pointer flex-1 bg-gray-200 h-full flex items-center justify-center text-gray-500 font-semibold">
						<router-link
							:to="{'name': 'auth.signup'}">Criar nova conta
						</router-link>
					</div>
				</nav>

				<!--				<h2 class="mt-6 text-center text-3xl font-bold text-gray-900">-->
				<!--					Acesse sua conta-->
				<!--				</h2>-->

				<!--				<p class="mt-2 text-center text-sm text-gray-600">-->
				<!--					Ou-->
				<!--					<router-link-->
				<!--						class="font-medium text-blue-700 hover:text-blue-400"-->
				<!--						:to="{'name': 'auth.signup'}">Crie uma nova</router-link>-->
				<!--				</p>-->

			</div>

			<lsm-inline-notification
				v-if="userCreatedMessage"
				:description="userCreatedMessage"
				kind="success"
				title="Login realizado com sucesso:">
			</lsm-inline-notification>

			<lsm-inline-notification
				v-if="loginErrorMessage"
				:description="loginErrorMessage.description"
				:title="loginErrorMessage.title"
				kind="error">
			</lsm-inline-notification>


			<recaptcha-protected-resource>

				<form
					action="#"
					class="mt-8 space-y-6"
					method="POST"
					@submit.prevent="submitForm">


					<div class="rounded-md shadow-sm -space-y-px">
						<lsm-input
							id="email"
							:key="loginErrorMessage"
							v-model="email"
							:disabled="Boolean(userCreatedMessage)"
							autocomplete="username"
							autofocus
							class="rounded-t-md disabled:opacity-50"
							label="Endereço de email"
							maxlength="256"
							minlength="4"
							name="email"
							placeholder="Digite seu endereço de email"
							required
							type="email"/>

						<lsm-input
							id="current-password"
							v-model="password"
							:disabled="Boolean(userCreatedMessage)"
							autocomplete="current-password"
							class="rounded-b-md disabled:opacity-50"
							label="Password"
							maxlength="128"
							minlength="8"
							name="password"
							placeholder="Digite sua senha"
							required
							type="password"
						/>

					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center cursor-pointer">
							<input
								id="remember_me"
								v-model="shouldRememberUserEmail"
								class="cursor-pointer h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								name="remember_me"
								type="checkbox"/>
							<label
								class="cursor-pointer ml-2 block text-sm text-gray-900"
								for="remember_me">
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
							:disabled="Boolean(loadingState || userCreatedMessage || !isLoginFormValid)"
							:is-loading="loadingState"
							class="w-full"
							icon-id="lock"
							label="Acessar conta"
							type="submit">
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
					id="google-login-button"
					:disabled="loadingState"
					class="
					py-2 px-4 border flex justify-between items-center
					relative border-solid border shadow-sm border-gray-400
                        font-semibold text-gray-600 text-sm py-2 text-center rounded text-center w-full
                        focus:outline-none hover:border-indigo-600"
					href="/auth/google?action=signin"
					title="Clique para acessar sua conta através do Google"
					type="button">
					<span>
						Entre com Google
					</span>
					<font-awesome-icon
						:icon="['fab', 'google']"
						style="line-height: 28px;"/>
				</a>
			</div>
		</div>
	</div>

</template>


<script>

import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";
import RecaptchaProtectedResource from "../recaptcha-protected-resource";
import LsmInlineNotification from "../../../../../_etc/shared_components/ui/lsm-inline-notification";

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
		};
	},
	"computed": {

		"email": {
			get () {
				return this.$store.getters["auth/email"];
			},
			set (value) {
				this.$store.commit("auth/email", value);
			}
		},

		"password": {
			get () {
				return this.$store.getters["auth/password"];
			},
			set (value) {
				this.$store.commit("auth/password", value);
			}
		},

		"shouldRememberUserEmail": {
			get () {
				return this.$store.getters["auth/shouldRememberUserEmail"];
			},
			set (value) {
				this.$store.commit("auth/shouldRememberUserEmail", value);
			}
		},

		"loadingState": {
			get () {
				return this.$store.getters["auth/loadingState"];
			}
		},

		"isLoginFormValid": function () {
			return this.email && this.password && this.password.length >= 8;
		},

		"loginErrorMessage": {
			get () {
				return this.$store.getters["auth/loginErrorMessage"];
			},
			set (value) {
				this.$store.commit("auth/loginErrorMessage", value);
			}
		}

	},
	"methods": {

		async submitForm () {

			if (this.isLoginFormValid) {
				this.loginErrorMessage = "";
				let hasRedirectPath = await this.$store.dispatch("auth/login");
				if (hasRedirectPath) {
					this.triggerAutomatedLogin(hasRedirectPath);
				}
			}

		},

		triggerAutomatedLogin (redirectPath = "/") {
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
			};

		} else if (errorStatus === 409) {

			this.loginErrorMessage = {
				"title": "Já existe uma conta cadastrada com este e-mail!",
				"description": "Faça o login abaixo."
			};

		} else if (errorStatus) {

			console.log(errorStatus);
			this.loginErrorMessage = {
				"title": "Houve um problema inesperado no seu login com Google!",
				"description": "Tente novamente em alguns minutos."
			};

		}

	}
};
</script>

<style scoped>

</style>