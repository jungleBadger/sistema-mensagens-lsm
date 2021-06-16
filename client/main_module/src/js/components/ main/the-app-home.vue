<template>
	<div
		class="w-full flex flex-col flex-1 overflow-auto h-full "
		ref="scroller">

		<!--		<header class="w-full mb-2">-->
		<!--			<h4 class="text-2xl">Sistema de Mensagens LSM</h4>-->
		<!--			<span>Você pode explorar Eventos e Mensagens abaixo. Monte seu carrinho com as mensagens desejadas.</span>-->
		<!--		</header>-->

		<div
			style="min-height: 144px;"
			class="w-full bg-black h-36 bg-gray-500"></div>

		<the-event-list></the-event-list>

	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import TheEventList from "./events/the-event-list";

// import gsap from "gsap";
// import ScrollTrigger from "gsap/src/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);


export default defineComponent({
	"name": "AppHome",
	"components": { TheEventList },
	setup () {
		return {
			...useI18n()
		};
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
