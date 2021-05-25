<template>

	<section class="flex flex-col flex-1 h-full max-h-full">
		<the-app-header>
			<template v-slot:app-menu>
			</template>
		</the-app-header>


		<main
			class="overflow-y-hidden flex-1 flex z-10"
			style="background-color: #d7e8ef;">

			<the-app-side-menu></the-app-side-menu>

			<router-view
				class="overflow-y-auto p-1 md:p-4 flex-1"
				v-slot="{ Component }">
				<transition
					@enter="fadeIn"
					@leave="fadeOut"
					mode="out-in"
					:css="false">
					<component :is="Component" />
				</transition>
			</router-view>

		</main>
		<lsm-toast-notification-container></lsm-toast-notification-container>
	</section>



</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from "vue";
import TheAppHeader from "./core/the-app-header.vue";
import TheAppSideMenu from "./core/the-app-side-menu.vue";
import fade from "../../../../_etc/shared_mixins/fade";
import LsmToastNotificationContainer
	from "../../../../_etc/shared_components/ui/notification/lsm-toast-notification-container";

export default defineComponent({
	"name": "LsmAdminApp",
	"mixins": [
		fade
	],
	"components": {
		LsmToastNotificationContainer,
		TheAppHeader,
		TheAppSideMenu
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">





</style>
