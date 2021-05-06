<template>
	<header
		id="lsm-header"
		class="bg-white w-full min-h-12 flex items-center justify-between min-h-12 shadow-sm z-20">

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
	},
	setup() {
		return {
			...useI18n()
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
