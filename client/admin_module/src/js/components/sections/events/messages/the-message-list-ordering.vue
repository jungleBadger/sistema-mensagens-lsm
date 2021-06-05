<template>
	<aside
		class="w-full h-full absolute left-0 top-0 border-0 m-0 p-0 z-50">
		<lsm-modal
			class="h-auto"
			@close="goToParentEventDetails">

			<template v-slot:modal-header>
				<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
					Organizar ordem das mensagens
				</h3>
			</template>

			<template v-slot:modal-content>


				<div
					v-if="localMessages.length"
					class="w-full flex flex-col overflow-hidden gap-2">
					<div
						class="flex items-center justify-end">
						<lsm-button
							class="w-40"
							icon-id="rotate-right"
							icon-style="fas"
							kind="secondary"
							label="Reiniciar ordem"
							@click="resetMessagesOrder"></lsm-button>

					</div>
					<draggable

						:list="localMessages"
						chosenClass="bg-gray-300"
						class="w-full list-group transition-colors"
						dragClass="bg-blue-500"
						ghostClass="bg-gray-300">


						<transition-group
							name="flip-list"
							type="transition">
							<div
								v-for="(element, index) in localMessages"
								:key="element.title"
								class="list-group-item flex bg-white border radius-sm items-start gap-1.5 p-1.5 mb-1.5 shadow-sm cursor-move">

								<lsm-select
									:model-value="index + 1"
									:options="orderOptions"
									aria-disabled="true"
									aria-readonly="true"
									class="cursor-pointer"
									style="min-width: 152px;"
									@change="organizeArray($event, index)">
								</lsm-select>
								<div class="flex flex-col gap-1 divide-y">
									<div class="flex gap-1 text-gray-900">
										<span>
											{{ element.brotherName }}
										</span>
										<span>-</span>
										<i18n-d
											:value="element.messageDate"
											format="short"
											locale="pt"
											tag="span"
										></i18n-d>

									</div>
									<span
										class="text-gray-600"
										style="word-break: break-word;">
									{{ element.title }}
								</span>
								</div>
							</div>
						</transition-group>

					</draggable>


				</div>
				<template v-else>
					<span>Evento não possui mensagens registradas.</span>
				</template>

			</template>

			<template v-slot:modal-footer>
				<div class="w-full h-9 flex items-center justify-end gap-2">

					<lsm-button
						kind="tertiary"
						label="Cancelar"
						@click="goToParentEventDetails">
					</lsm-button>

					<lsm-button
						v-if="localMessages.length"
						:is-loading="isLoading"
						class="w-24"
						icon-id="check"
						icon-style="fas"
						label="Salvar"
						role="button"
						@click="submitForm">
					</lsm-button>
				</div>

			</template>

		</lsm-modal>

	</aside>


</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import { VueDraggableNext } from "vue-draggable-next";
import LitepieDatepicker from "litepie-datepicker";
import LsmModal from "../../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmInput from "../../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";
import LsmTextArea from "../../../../../../../_etc/shared_components/ui/lsm-text-area";
import LsmSelect from "../../../../../../../_etc/shared_components/ui/lsm-select";

export default defineComponent({
	"name": "TheMessageListOrdering",
	"components": {
		"draggable": VueDraggableNext,
		LitepieDatepicker,
		LsmSelect,
		LsmTextArea,
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"localMessages": []
		};
	},
	"computed": {
		"messages": function () {
			return this.$store.getters["messages/messageItemsByEventId"];
		},

		"orderOptions": function () {
			return new Array(this.localMessages.length).fill({}).map((val, index) => {
				return {
					"id": index + 1,
					"label": `Posição ${index + 1}`
				};
			});
		}
	},
	"methods": {
		organizeArray (ev, oldIndex) {

			let newIndex = Number(ev.target.value) - 1;

			if (newIndex >= this.localMessages.length) {
				let k = newIndex - this.localMessages.length + 1;
				while (k) {
					k -= 1;
					this.localMessages.push(undefined);
				}
			}
			this.localMessages.splice(newIndex, 0, this.localMessages.splice(oldIndex, 1)[0]);
		},
		goToParentEventDetails () {
			return this.$router.push({
				"name": "app.events.details",
				"params": { "eventId": this.$route.params.eventId }
			});
		},
		async submitForm () {
			this.isLoading = true;
			await this.$store.dispatch(
				"messages/organizeMessages",
				{
					"eventId": this.$route.params.eventId,
					"messages": this.localMessages.map((message, index) => {
						return {
							"id": message.id,
							"order": index + 1
						};
					})
				}
			);
			this.isLoading = false;
			await this.$store.dispatch("messages/retrieveMessagesByEventId", this.$route.params.eventId);
		},
		resetMessagesOrder () {
			this.localMessages = this.messages.map(message => message);
		}
	},
	created () {
		this.resetMessagesOrder();
	},

	"watch": {
		messages () {
			this.resetMessagesOrder();
		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.flip-list-move {
	transition: transform 0.5s;
}

.no-move {
	transition: transform 0s;
}
</style>
