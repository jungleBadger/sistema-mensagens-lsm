<template>
	<div
		:class="{
			'bg-green-600 text-white': notification.kind === 'success',
			'bg-yellow-500 text-gray-800': notification.kind === 'warning',
			'bg-red-600 text-white': notification.kind === 'error'
		}"
		style="min-width: 18rem; width: auto"
		class="cursor-default bg-white h-auto p-1 rounded shadow-lg z-40 bg-opacity-90 mt-2">


<!--		<cv-toast-notification-->
<!--			:key="notification.id"-->
<!--			:kind="notification.kind"-->
<!--			:title="notification.title"-->
<!--			:sub-title="notification.subtitle"-->
<!--			:caption="notification.caption"-->
<!--			@close="handleCloseRequest"-->
<!--			:close-aria-label="'close'">-->
<!--		</cv-toast-notification>-->
<!--		-->


		<div>
			<h6 class="font-semibold">{{notification.title}}</h6>
			<p>{{notification.subtitle}}</p>
		</div>


		<template v-if="actionType === 'undo'">
			<lsm-button
				class="notification-action-button"
				@click="executeHandler">
				<span>Undo operation</span>
				<span class="bx--btn__icon">
						<font-awesome-icon :icon="['fal', 'undo']"></font-awesome-icon>
					</span>
			</lsm-button>
		</template>
		<template v-else-if="actionType">
			<lsm-button
				class="notification-action-button"
				@click="executeHandler">
				<span>Retry operation</span>
				<span class="bx--btn__icon">
						<font-awesome-icon :icon="['fal', 'sync']"></font-awesome-icon>
					</span>

			</lsm-button>
		</template>
	</div>

</template>
<script type="text/javascript">
"use strict";

import { defineComponent } from "vue";
import LsmButton from "../lsm-button";
export default defineComponent(
	{
		"name": "LsmToastNotification",
		"components": { LsmButton },
		"props": {
			"notification": {
				"type": Object,
				"required": true
			},
			"actionType": {
				"type": String,
				"default": "",
				"required": false,
				"validator": val => ["", "retry", "undo"].includes(val)
			},
			"actionHandler": {
				"type": Function,
				"default": () => false,
				"required": false
			}
		},

		"computed": {
		},
		"methods": {
			handleCloseRequest() {
				this.$store.commit("notification/dismissNotification", this.notification.id);
			},
			async executeHandler() {
				try {
					await this.actionHandler();
				} catch (e) {
					console.log(e);
				}
				this.handleCloseRequest();
			}
		},
		"mounted": function () {
			window.setTimeout(() => {
				this.handleCloseRequest();
			}, this.notification.disappearInMs || 5000);

		}
	}
);


</script>
<style scoped lang="scss" rel="stylesheet/scss">


</style>
