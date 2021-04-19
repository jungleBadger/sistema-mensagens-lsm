"use strict";

import { createRouter, createWebHistory } from "vue-router";
import TheLoginForm from "../components/forms/the-login-form.vue";
import TheSignupForm from "../components/forms/the-signup-form.vue";

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
		}

	]
})

