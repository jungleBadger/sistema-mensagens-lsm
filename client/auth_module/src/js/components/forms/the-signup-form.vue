<template>
	<div>
		SIGNUP
		<router-link :to="{'name': 'auth.login'}">Login</router-link>
	</div>
</template>

<script>

// General - Invalid form.
// Basic - Account already exists.
// Google - Account already exists - but not linked.
// Google - Account already exists - and it is linked.

export default {
	name: "TheSignupForm"
}
</script>

<style scoped>

</style>