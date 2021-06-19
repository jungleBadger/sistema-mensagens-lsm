<template>
	<div
		ref="scroller"
		class="w-full flex flex-col flex-1 overflow-auto h-full">
		<div
			v-if="!isLoading && (enableRuleMessage || enableLoginMessage)"
			class="w-full bg-gray-400 h-36 flex items-center"
			style="min-height: 144px;">

			<div
				v-if="enableRuleMessage"
				class="w-full md:w-64 h-5/6 ml-0 md:ml-12 bg-white rounded-sm flex flex-col shadow">
				<main class="pt-1 px-2 flex-1 flex flex-col">
					<span class="font-semibold">Atenção</span>
					<span class="text-sm">Toda mensagem adquirida é pessoal e intransferível.</span>
				</main>

				<footer class="flex px-2 pb-1 self-end">
					<lsm-button
						icon-id="check"
						icon-style="fas"
						label="Entendi"
						@click="declareAcknowledgeRuleMessage"></lsm-button>
				</footer>

			</div>

			<div
				v-if="enableLoginMessage"
				class="w-full md:w-64 h-5/6 ml-0 md:ml-12 bg-white rounded-sm flex flex-col shadow">
				<main class="pt-1 px-2 flex-1 flex flex-col">


					<span class="font-semibold">Atenção</span>
					<span class="text-sm">Para ver mais detalhes das mensagens e adquiri-las <a
						class="text-blue-700"
						href="/auth/signup">
						registre-se
					</a> ou faça o <a
						class="text-blue-700"
						href="/auth/login">
						login.
					</a></span>
				</main>

				<footer class="flex px-2 pb-1 self-end">
					<lsm-button
						icon-id="check"
						icon-style="fas"
						label="Entendi"
						@click="declareAcknowledgeLoginMessage"></lsm-button>
				</footer>
			</div>
		</div>
		<the-event-list
			ref="eventList"></the-event-list>

	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import TheEventList from "./events/the-event-list";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";

// import gsap from "gsap";
// import ScrollTrigger from "gsap/src/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
	"name": "AppHome",
	"components": {
		LsmButton,
		TheEventList
	},
	setup () {
		return {
			...useI18n()
		};
	},
	"data": function () {
		return {
			"isLoading": true
		}
	},
	"computed": {
		"isLoggedIn": function () {
			return this.$store.getters["utilities/userInfo"].id;
		},
		"enableRuleMessage": function () {
			return this.isLoggedIn && !this.$store.getters["utilities/acknowledgeRuleMessage"];
		},
		"enableLoginMessage": function () {
			return !this.isLoggedIn && !this.$store.getters["utilities/acknowledgeLoginMessage"];
		}
	},
	"methods": {
		"declareAcknowledgeRuleMessage": function () {
			return this.$store.dispatch("utilities/acknowledgeRuleMessage");
		},
		"declareAcknowledgeLoginMessage": function () {
			return this.$store.dispatch("utilities/acknowledgeLoginMessage");
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.isLoading = false;
		});
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
