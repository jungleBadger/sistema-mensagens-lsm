<template>
	<header
		id="lsm-header"

		class="flex p-2 items-center justify-between">
		<slot name="app-menu">

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
