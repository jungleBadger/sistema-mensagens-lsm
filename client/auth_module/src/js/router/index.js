"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheLoginForm from "../components/forms/the-login-form.vue";
import TheSignupForm from "../components/forms/the-signup-form.vue";
import ThePasswordResetForm from "../components/forms/the-password-reset-form.vue";
import ThePasswordResetCompleteForm from "../components/forms/the-password-reset-complete-form.vue";

export default createRouter({
	"base": "/auth",
	"history": createWebHistory("/auth"),
	"routes": [
		{
			"name": "auth.login",
			"path": "/login",
			"component": TheLoginForm
		},
		{
			"name": "auth.signup",
			"path": "/signup",
			"component": TheSignupForm
		},
		{
			"name": "auth.reset",
			"path": "/reset",
			"component": ThePasswordResetForm
		},
		{
			"name": "auth.reset.complete",
			"path": "/reset/complete",
			"component": ThePasswordResetCompleteForm
		},
		{
			"path": "/:pathMatch(.*)*",
			"redirect": {
				"name": "auth.login"
			}
		}

	]
})

