<template>
	<div
		ref="scroller"
		class="w-full flex flex-col flex-1 overflow-auto h-full">

		<transition
			@enter="fadeIn"
			@leave="fadeOut"
			mode="out-in"
			:css="false">
			<div
				v-if="!isLoading && (enableRuleMessage || enableLoginMessage)"
				class="w-full bg-white py-2 px-4 flex items-center absolute z-50 shadow-xl">



				<div
					v-if="enableRuleMessage"
					class="w-full h-full flex flex-col">

					<main class="flex-1 flex flex-col">
						<span class="text-xl font-semibold">Política de uso dos áudios</span>
						<span class="text-lg">Os arquivos de áudio MP3 do Living Stream Ministry não devem ser copiados, reproduzidos, modificados, feito upload, postados, recodificados, transmitidos ou distribuídos em nenhuma circustância (incluindo “espelhamento”) para nenhum outro computador (além do seu próprio computador ou dispositivo de áudio portátil), servidor, web site ou outro meio de distribuição ou para qualquer fim comercial.</span>
					</main>

					<footer class="flex self-end">
						<lsm-button
							icon-id="check"
							icon-style="fas"
							label="Entendi"
							@click="declareAcknowledgeRuleMessage"></lsm-button>
					</footer>

				</div>


				<div
					v-if="enableLoginMessage"
					class="w-full h-full flex flex-col">
					<main class="flex-1 flex flex-col">


						<span class="text-xl font-semibold">Atenção</span>
						<span class="text-lg">Para ver mais detalhes das mensagens e adquiri-las <a
							class="text-blue-700"
							href="/auth/signup">
						registre-se
					</a> ou faça o <a
							class="text-blue-700"
							href="/auth/login">
						login.
					</a></span>
					</main>

					<footer class="flex self-end">
						<lsm-button
							icon-id="check"
							icon-style="fas"
							label="Entendi"
							@click="declareAcknowledgeLoginMessage"></lsm-button>
					</footer>
				</div>
			</div>
		</transition>

		<the-event-list class="p-2"></the-event-list>

	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import TheEventList from "./events/the-event-list";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";
import fade from "../../../../../_etc/shared_mixins/fade";

// import gsap from "gsap";
// import ScrollTrigger from "gsap/src/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
	"name": "AppHome",
	"mixins": [
		fade
	],
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
