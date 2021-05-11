<template>
	<section
		aria-label="Home da aplicação"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative gap-4">

		<header class="flex gap-4">
			<div class="flex flex-col gap-2 flex-1">

				<h3 class="text-2xl">Início</h3>
				<h4 class="text-l">
					Nada precisa da sua atenção hoje. <a class="text-blue-700" href="/app">Acessar app principal.</a>
				</h4>

			</div>
		</header>


	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";


export default defineComponent({
	"name": "TheAppHome",
	"components": {
		LsmInput
	},
	"data": function () {
		return {
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
