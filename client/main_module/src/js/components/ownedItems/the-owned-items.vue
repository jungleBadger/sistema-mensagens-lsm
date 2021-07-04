<template>
	<section
		ref="scroller"
		aria-label="Area do usuário"
		class="w-full h-full overflow-auto flex flex-col relative gap-4"
		style="background-color: #f9fafb;">

		<header class="flex flex-col md:flex-row gap-2 p-1 md:p-4 pb-0">
			<div class="flex flex-col gap-1 flex-1 pl-2 pr-2 pt-0  md:pl-0 md:pr-0 ">
				<h3 class="text-2xl">Mensagens adquiridas</h3>
				<h4 class="text-l">
					Nesta área você pode navegar pelas suas mensagens adquiridas. Cada mensagem é agrupada em seu evento
					para melhor organização.
				</h4>
				<h5><span class="font-semibold">Para visualizar seus pedidos</span> acesse a <router-link
					class="text-blue-700"
					:to="{'name': 'app.profile'}">área de Perfil e Pedidos.</router-link></h5>
			</div>

		</header>

		<the-private-event-list class="p-1 md:p-4 "></the-private-event-list>

		<the-app-footer></the-app-footer>

		<transition
			mode="out-in"
			@enter="fadeIn"
			@leave="fadeOut"
		>
			<aside
				style="z-index: 53;"
				class="fixed flex w-full bg-white bottom-0 left-0 p-2 shadow items-center gap-2">
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
import TheAppFooter from "../core/the-app-footer";

export default defineComponent({
	"name": "TheOwnedItems",
	"mixins": [
		fade
	],
	"components": {
		TheAppFooter,
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
