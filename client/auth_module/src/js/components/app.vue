<template>

	<div id="lsm-app">
		<main>
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</main>
	</div>

</template>
<script type="text/javascript">
"use strict";

import { defineComponent } from "vue";

export default defineComponent({
	"name": "LsmApp",
	"components": {
	},
	async beforeCreate () {
		return await Promise.all([
			this.$store.dispatch("auth/checkCaptchaLatestTs"),
			this.$store.dispatch("auth/retrieveStoredEmail")
		]);
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
