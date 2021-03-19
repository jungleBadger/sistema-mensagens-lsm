<template>
	<li
		class="app-side-menu-level-item"
		@click="applyItemContext(menuItem, index)">
		<template v-if="menuItem.children && menuItem.children.find(item => item.meta?.indexed)">

			<template v-if="itemIcon">
				<font-awesome-icon :icon="itemIcon"></font-awesome-icon>
			</template>
			<span>
				{{menuItem.name}} {{isMenuOpen}}
			</span>
		</template>

		<template v-else>
			{{menuItem.name}}
		</template>


	</li>
</template>
<script type="text/javascript">
"use strict";

import { computed, defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
	"name": "AppSideMenuLevelItem",

	setup() {
		const internalInstance = getCurrentInstance();
		return {
			"itemIcon": computed(() => internalInstance.props.menuItem?.meta.icon ? internalInstance.props.menuItem?.meta.icon : "")
		}
	},
	"inject": [
		"menuLevel",
		"isMenuOpen"
	],
	"props": {
		"itemMenuLevel": {
			"type": Number,
			"required": false,
			"default": function () {
				return 0;
			}
		},
		"menuItem": {
			"type": Object,
			"required": true
		}
	},

	"data": function () {
		return {
			"selectedItemInfo": null
		}
	},

	"methods": {
		"applyItemContext": function (menuItem, menuItemIndex) {
			this.$nextTick(() => {
				// let xValue = this.level === 0 ? `${this.parentWidth}px` : "100%";
				// let yValue = this.$refs.listItems[menuItemIndex].offsetTop;

				this.selectedItemInfo = menuItem;
				// this.$refs.floatingMenu.style.display = "block";


				// this.$refs.floatingMenu.style.transform = `translateX(${xValue}) translateY(${yValue}px)`;

			});
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
