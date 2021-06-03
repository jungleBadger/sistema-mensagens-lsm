<template>
	<header
		id="lsm-header"
		style="z-index: 52;"
		class="bg-white w-full min-h-12 flex items-center justify-between min-h-12 shadow">

		<slot name="app-menu">
			<button
				aria-controls="lsm-sidemenu"
				class="bg-white text-gray-800 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-400 transition-colors w-12 h-12 flex items-center justify-center"
				@click="toggleMenu">
				<template v-if="isSideMenuOpen">
					<span
						role="img"
						aria-label="Fechar menu de navegação">
						<font-awesome-icon :icon="['fal', 'xmark']"/>
					</span>
				</template>
				<template v-else>
					<span
						role="img"
						aria-label="Abrir menu de navegação">
						<font-awesome-icon :icon="['fal', 'bars']"/>
					</span>
				</template>
			</button>
		</slot>

		<slot name="app-title">

		</slot>

		<slot name="app-buttons">

		</slot>
	</header>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";

export default defineComponent({
	"name": "TheAppSideMenu",
	"computed": {
		"isSideMenuOpen": {
			get() {
				return this.$store.getters["utilities/isSideMenuOpen"];
			},
			set(value) {
				this.$store.commit("utilities/isSideMenuOpen", value);
			}
		}
	},
	"methods": {
		toggleMenu() {
			this.isSideMenuOpen = !this.isSideMenuOpen;
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">


#lsm-header {
	width: 100%;
	height: 48px;
}

</style>
