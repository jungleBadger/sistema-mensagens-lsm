<template>
	<section
		aria-label="Home"
		class="h-full p-2 ">
		ADMIN - Em construção
		<h3>{{test}}</h3>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
		<lsm-input v-model="test"></lsm-input>
	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";


export default defineComponent({
	"name": "TheAppHome",
	"components": {
		LsmInput
	},
	"data": function () {
		return {
			"test": "aff"
		}
	},
	setup() {
		return {
			...useI18n()
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
