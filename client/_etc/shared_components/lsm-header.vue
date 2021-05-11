<template>
	<header
		id="lsm-header"
		class="w-full min-h-12 flex items-center justify-between min-h-12 shadow-sm">

		<slot name="app-menu">
			<button
				class="w-12 h-12 flex items-center justify-center"
				@click="toggleMenu">
				<template v-if="isMenuOpen">
					<font-awesome-icon :icon="['fal', 'xmark']"/>
				</template>
				<template v-else>
					<font-awesome-icon :icon="['fal', 'bars' ]"/>
				</template>
			</button>
		</slot>

		<slot name="app-title">
			<h2 class="m-0">LSM App</h2>
		</slot>

		<slot name="app-buttons">

		</slot>
	</header>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
	"name": "LsmSideMenu",
	"data": function () {
		return {
			"isMenuOpen": false
		}
	},
	"methods": {
		toggleMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		}
	},
	setup() {
		return {
			...useI18n()
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

@import "../css/variables.scss";

#lsm-header {
	width: 100%;
	height: 48px;
	background-color: $primary-dark-color;
}

</style>
