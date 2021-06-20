<template>
	<section
		style="background-color: #f9fafb;"
		aria-label="Area do usuário"
		class="w-full h-full overflow-auto flex flex-col relative p-1 md:p-4 gap-4">

		<section>
			<header class="flex mb-3 pl-2 pr-2 pt-0 flex-col md:flex-row md:pl-0 md:pr-0 gap-2">
				<div class="flex flex-col gap-0 flex-1">
					<h3 class="text-2xl">Mensagens adquiridas</h3>
					<h4 class="text-l">
						Nesta área você pode navegar pelas suas mensagens adquiridas. Cada mensagem é agrupada em seu evento para melhor organização.
					</h4>
				</div>

			</header>

			<main
				class="w-full flex-1 overflow-hidden bg-white p-2 shadow rounded"
				role="main"
				aria-label="Mensagens adquiridas">
				{{ownedItems}}
			</main>
		</section>





<!--		<router-view-->
<!--			v-slot="{ Component }">-->
<!--			<transition-->
<!--				@enter="fadeIn"-->
<!--				@leave="fadeOut"-->
<!--				mode="out-in"-->
<!--				:css="false">-->
<!--				<component :is="Component" />-->
<!--			</transition>-->
<!--		</router-view>-->


	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmTable from "../../../../../_etc/shared_components/ui/lsm-table.vue";

import fade from "../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheOwnedItems",
	"mixins": [
		fade
	],
	"components": {
		LsmButton,
		LsmTable
	},
	"data": function () {
		return {
			"asyncFilterColumn": "",
			"asyncFilterText": ""
		}
	},
	"computed": {
		"userInfo": function () {
			return this.$store.getters["utilities/userInfo"];
		},
		"ownedItems": function () {
			return this.$store.getters["orders/ownedItems"];
		}

	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
