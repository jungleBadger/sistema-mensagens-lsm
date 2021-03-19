<template>
	<aside
		id="app-side-menu"
		:aria-expanded="isMenuOpen"
		:class="{'__is-menu-open': isMenuOpen}">
		<button
			id="app-side-menu-button"
			aria-controls="app-side-menu-wrapper"
			@click="toggleMenu">
			<font-awesome-icon
				:key="menuButtonIcon.iconName"
				:icon="menuButtonIcon">
			</font-awesome-icon>
		</button>

		<section
			id="app-side-menu-wrapper">
			<app-side-menu-level
				:menu-level="0"
				:menuItems="availableRoutes">
			</app-side-menu-level>
		</section>
	</aside>

</template>
<script type="text/javascript">
"use strict";

import { computed, defineComponent, ref } from "vue";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import AppSideMenuLevel from "./app-side-menu-level.vue";

export default defineComponent({
	"name": "AppSideMenu",
	"components": {
		AppSideMenuLevel
	},
	"provide": function () {
		return {
			"isMenuOpen": this.menuButtonIcon
		}
	},
	setup() {
		let isMenuOpen = ref(false);

		const toggleMenu = () => {
			isMenuOpen.value = !isMenuOpen.value
		}

		return {
			isMenuOpen,
			"menuButtonIcon": computed(() => isMenuOpen.value ? faTimes : faBars),
			toggleMenu
		}
	},
	"data": function () {
		return {
		};
	},
	"computed": {
		availableRoutes() {
			// getRoutes fetch nested routes as well
			return (
				(this.$router.options.routes || this.$router.getRoutes() || [])
			).filter(
				route => route.meta?.indexed
			).map(route => {
				return {
					"name": route.name,
					"path": route.path,
					"meta": route.meta,
					"children": route.children
				}
			}).sort(
				(a, b) => {
					return a.name > b.name ? 1 : -1
				}
			);
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

@import "../../../../css/variables.scss";

#app-side-menu {
	background-color: #f9f9f9;
	grid-area: app-side-menu;
	width: 48px;
	display: flex;
	flex-direction: column;
	position: relative;

	#app-side-menu-button {
		height: 48px;
		width: 48px;
		background-color: $primary-bg-color;
		cursor: pointer;
		color: $primary-text-color;
		border: 0;
	}

	#app-side-menu-wrapper {
		width: 48px;
		flex: 1;
		overflow: hidden;
		transition: width 0.5s ease-out;
		background-color: inherit;

	}

	&.__is-menu-open {
		#app-side-menu-button {
		}

		#app-side-menu-wrapper {
			transition: width 0.5s ease-in;
			width: 240px;
		}
	}
}
</style>
