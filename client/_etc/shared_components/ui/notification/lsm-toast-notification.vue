<template>
	<div
		@mouseenter="pauseCloseListener"
		@mouseleave="resumeOrStartCloseListener"
		:class="{
			'bg-green-600 text-white': notification.kind === 'success',
			'bg-yellow-500 text-gray-800': notification.kind === 'warning',
			'bg-red-600 text-white': notification.kind === 'error'
		}"
		style="min-width: 18rem; width: auto; z-index: 99;"
		class="cursor-default bg-white h-auto p-1 rounded shadow-lg bg-opacity-90 mt-2 p-1 relative">

		<div class=" w-full h-full">
			<button
				class="absolute w-6 h-6 right-1 top-1"
				@click="handleCloseRequest">
				<span
					role="img"
					aria-label="Fechar notificação">
						<font-awesome-icon :icon="['fal', 'xmark']" />
					</span>

			</button>
			<h6 class="pl-1 pr-4 font-semibold">{{notification.title}}</h6>
			<p class="pl-1 pr-1.5">{{notification.subtitle}}</p>
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

		"data": function () {
			return {
				"timeout": null
			}
		},
		"computed": {
		},
		"methods": {

			pauseCloseListener() {
				if (this.timeout) {
					window.clearTimeout(this.timeout);
					this.timeout = null;
				}
			},

			resumeOrStartCloseListener() {
				this.timeout = window.setTimeout(() => {
					this.handleCloseRequest();
				}, this.notification.disappearInMs || 5000);
			},

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
			this.resumeOrStartCloseListener();

		}
	}
);


</script>
<style scoped lang="scss" rel="stylesheet/scss">


</style>
