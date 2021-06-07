<template>
	<div class="w-full h-full px-8 pt-4">
		<the-event-list></the-event-list>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import TheEventList from "./events/the-event-list";

export default defineComponent({
	"name": "AppHome",
	components: { TheEventList },
	setup() {
		return {
			...useI18n()
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
