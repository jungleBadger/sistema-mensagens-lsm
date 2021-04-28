<template>

	<div id="lsm-app">

		<lsm-header>

			<template v-slot:app-buttons>
				<div>
					<a href="/auth/login">Entrar</a>
				</div>
			</template>

		</lsm-header>

		<main class="p-4">
			<router-view></router-view>
		</main>
	</div>

</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from "vue";
import LsmHeader from "../../../../_etc/shared_components/lsm-header"

export default defineComponent({
	"name": "LsmApp",
	"components": {
		LsmHeader
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
