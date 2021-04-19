<template>

	<div id="lsm-app">
		<main>
			<router-view></router-view>
		</main>
	</div>

</template>
<script type="text/javascript">
"use strict";

import { defineComponent } from "vue";
import LsmHeader from "../../../../_etc/shared_components/lsm-header"

export default defineComponent({
	"name": "LsmApp",
	"components": {
		LsmHeader
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
