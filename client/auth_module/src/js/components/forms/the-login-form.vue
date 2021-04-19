<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">

			<div>

				<img
					class="mx-auto h-12 w-auto"
					src="/_etc/assets/logo.png"
					alt="Workflow"
				/>

				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to your account
				</h2>

				<p class="mt-2 text-center text-sm text-gray-600">
					Or
					<router-link
						class="font-medium text-indigo-600 hover:text-indigo-500"
						:to="{'name': 'auth.signup'}">Signup</router-link>
				</p>

			</div>

			<form
				class="mt-8 space-y-6"
				action="#"
				method="POST">

				<div class="rounded-md shadow-sm -space-y-px">

					<lsm-input
						v-model="email"
						class="rounded-t-md"
						id="email"
						name="email"
						label="Email address"
						type="email"
						autocomplete="username"
						placeholder="Insira endereço de email"
						required
						autofocus />

					<lsm-input
						v-model="password"
						class="rounded-b-md"
						id="password"
						name="password"
						type="password"
						label="Password"
						autocomplete="current-password"
						placeholder="Insira senha"
						required />

				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember_me"
							name="remember_me"
							type="checkbox"
							class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
						<label
							for="remember_me"
							class="ml-2 block text-sm text-gray-900">
							Remember me
						</label>
					</div>

					<div class="text-sm">
						<a
							href="#"
							class="font-medium text-indigo-600 hover:text-indigo-500">
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<font-awesome-icon :icon="['fas', 'lock']"></font-awesome-icon>
						</span>
						<span>Sign in</span>
					</button>
				</div>
			</form>
		</div>
	</div>

</template>



<script>

import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";

// General - Invalid form.
// Basic - Account don't exist
// Basic - Incorrect password
// Google - Account not linked

export default {
	"name": "LoginForm",
	"components": {
		LsmInput
	},
	"data": function () {
		return {
			"email": "",
			"password": ""
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

		"isLoginFormValid": function () {
			return this.$store.getters["auth/isLoginFormValid"];
		}
	},
	"methods": {
		async doLogin() {
			await this.$store.dispatch("auth/login");
		}
	}
}
</script>

<style scoped>

</style>