<template>
	<section>
		Menu
	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
	"name": "AppSideMenu",
	setup() {
		return {
			...useI18n()
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
