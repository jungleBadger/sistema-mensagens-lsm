<template>
	<aside
		ref="floatingMenu"
		style="position:fixed; translateX(0%) translateY(0%); width: 240px; display: none;">
<!--		<app-side-menu-level-->
<!--			:menu-level="menuLevel + 1"></app-side-menu-level>-->
	</aside>
	<nav
	class="app-side-menu-level">
		<ul class="app-side-menu-level-wrapper">

			<template
				v-for="(menuItem, index) in menuItems"
				:key="menuItem.name">
				<app-side-menu-level-item
					:item-menu-level="menuLevel"
					:menu-item="menuItem">
				</app-side-menu-level-item>
			</template>


		</ul>
	</nav>
</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from "vue";
import AppSideMenuLevelItem from "./app-side-menu-level-item.vue";

export default defineComponent({
	"name": "AppSideMenuLevel",
	"components": {
		AppSideMenuLevelItem
	},
	"provide": function () {
		return {
			"menuLevel": this.menuLevel
		}
	},
	"props": {
		"menuLevel": {
			"type": Number,
			"required": false,
			"default": function () {
				return 0;
			},
			validator(value) {
				return value >= 0;
			}
		},
		"menuItems": {
			"type": Array,
			"required": true
		}
	}

});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

.app-side-menu-level {
	width: 100%;
	.app-side-menu-level-wrapper {
		list-style: none;
		padding: 0;
		.app-side-menu-level-item {

		}
	}
}

</style>
