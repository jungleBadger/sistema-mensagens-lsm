<template>

	<app-side-menu />

	<app-header />

	<main style="grid-area: app-content;">
		<router-view></router-view>
	</main>

</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from 'vue';
import AppSideMenu from "./core/side-menu/app-side-menu.vue"
import AppHeader from "./core/app-header.vue"

export default defineComponent({
	"name": "SampleApp",
	"components": {
		AppSideMenu,
		AppHeader
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
