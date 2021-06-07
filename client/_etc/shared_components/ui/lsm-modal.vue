<template>

	<div
		@keydown.esc="closeModal"
		class="flex w-full h-full max-h-full max-w-full items-center justify-center fixed overflow-y-auto left-0 top-0 border-0 m-0 p-0
		bg-opacity-50 bg-black z-50 md:p-12 backdrop-filter backdrop-blur-sm">
		<div
			v-bind="$attrs"
			style="transform: translate(0);"
			class="flex flex-col max-h-full max-w-full md:rounded shadow-lg bg-white w-full h-full transition-none md:w-auto md:h-auto ">

			<header
				class="w-full flex items-center gap-2 p-2 justify-between shadow-sm z-20">
				<slot name="modal-header">

				</slot>

				<button
					role="button"
					class="bg-white text-gray-800 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-400 transition-colors w-12 h-12 flex items-center justify-center"

					@click="closeModal">
					<span
						role="img"
						aria-label="Fechar modal.">
						<font-awesome-icon :icon="['fal', 'xmark']"/>
					</span>
				</button>
			</header>

			<main
				style="transform: translate(0);"
				class="flex-1 flex p-2 bg-gray-100 w-full md:overflow-y-visible box">
				<slot name="modal-content"></slot>
			</main>

			<footer

				class="w-full shadow-sm p-2 bg-white"
				style="z-index: -1; flex-basis: 52px; min-height: 52px;">
				<slot name="modal-footer">

				</slot>
			</footer>
		</div>
	</div>


</template>
<script>


import { v4 as uuidv4 } from 'uuid';
import fade from "../../shared_mixins/fade";
import LsmProgressBar from "./lsm-progress-bar";

export default {
	"name": "LsmModal",
	components: { LsmProgressBar },
	"mixins": [
		fade
	],
	"inheritAttrs": false,
	"emits": ["close"],
	"props": {

		"id": {
			"type": String,
			"required": false,
			"default": function () {
				return uuidv4();
			}
		}
	},

	"methods": {
		closeModal() {
			this.$emit("close");
		}
	}
}
</script>