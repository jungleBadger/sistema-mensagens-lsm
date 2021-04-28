<template>

	<lsm-header class="app-header">
		<template v-slot:app-menu>
			<button>
				MENU
			</button>
		</template>


	</lsm-header>
	<app-side-menu class="app-side-menu"></app-side-menu>
	<main class="app-content">
		<router-view></router-view>
	</main>


</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from "vue";
import LsmHeader from "../../../../_etc/shared_components/lsm-header"
import AppSideMenu from "./core/app-side-menu"

export default defineComponent({
	"name": "LsmAdminApp",
	"components": {
		AppSideMenu,
		LsmHeader
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">



.app-header {
	width: 100%;
	grid-area: header;
}

.app-side-menu {
	width: 48px;
	height: 100%;
	grid-area: sidemenu;
}

.app-content {
	width: 100%;
	height: 100%;
	grid-area: content;
}

</style>
