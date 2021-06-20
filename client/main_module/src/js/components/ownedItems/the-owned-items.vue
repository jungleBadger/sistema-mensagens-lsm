<template>
	<section
		ref="scroller"
		aria-label="Area do usuário"
		class="w-full h-full overflow-auto flex flex-col relative p-1 md:p-4 gap-4"
		style="background-color: #f9fafb;">

		<header class="flex mb-3 pl-2 pr-2 pt-0 flex-col md:flex-row md:pl-0 md:pr-0 gap-2">
			<div class="flex flex-col gap-0 flex-1">
				<h3 class="text-2xl">Mensagens adquiridas</h3>
				<h4 class="text-l">
					Nesta área você pode navegar pelas suas mensagens adquiridas. Cada mensagem é agrupada em seu evento
					para melhor organização.
				</h4>
			</div>

		</header>

		<the-private-event-list></the-private-event-list>

		<transition
			mode="out-in"
			@enter="fadeIn"
			@leave="fadeOut"
		>
			<aside
				v-if="selectedAudioPath"
				class="absolute flex w-full bg-white bottom-0 left-0 p-2 shadow items-center gap-2">
				<audio
					:key="selectedAudioPath"
					class="h-10 flex-1"
					autoplay
					controls>
					<source
						:src="selectedAudioPath"
						type="audio/mpeg">
				</audio>
				<button
					role="button"
					class="bg-white text-gray-800 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-400 transition-colors w-12 h-10 flex items-center justify-center"

					@click="dismissAudioPath">
					<span
						role="img"
						aria-label="Fechar modal.">
						<font-awesome-icon :icon="['fal', 'xmark']"/>
					</span>
				</button>
			</aside>
		</transition>


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
import ThePrivateEventList from "./privateEvents/the-private-event-list";

export default defineComponent({
	"name": "TheOwnedItems",
	"mixins": [
		fade
	],
	"components": {
		ThePrivateEventList,
		LsmButton,
		LsmTable
	},
	"data": function () {
		return {
			"asyncFilterColumn": "",
			"asyncFilterText": ""
		};
	},
	"computed": {
		"userInfo": function () {
			return this.$store.getters["utilities/userInfo"];
		},
		"ownedItems": function () {
			return this.$store.getters["orders/ownedItems"];
		},

		"selectedAudioPath": function () {
			return this.$store.getters["privateEvents/selectedAudioPath"];
		}

	},
	"methods": {
		dismissAudioPath() {
			this.$store.commit("privateEvents/selectedAudioPath", "");
		}
	},
	beforeUnmount () {
		this.dismissAudioPath();
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
