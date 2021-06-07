<template>
	<header
		id="lsm-header"
		style="z-index: 52;"
		class="bg-white w-full min-h-12 flex items-center justify-end min-h-12 shadow">

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
	"name": "TheAppHeader"
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">


#lsm-header {
	width: 100%;
	height: 48px;
}

</style>
