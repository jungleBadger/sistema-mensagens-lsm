<template>
	<lsm-modal @close="goToEventsHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Remover Evento {{ selectedEvent.id }}
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-96 flex flex-col gap-1">
				<label class="text-gray-700 ">Confirme a operação digitando <span class="font-semibold">REMOVER</span> abaixo.</label>
				<lsm-input
					v-model="confirmString"
					autofocus
					@keyup.enter="deleteItem"
					placeholder="Digite o valor de confirmação.">
				</lsm-input>
			</div>


		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-4">
				<lsm-button
					v-if="isDocumentExistent"
					:disabled="isFormInvalid"
					:is-loading="isLoading"
					class="w-24 bg-red-400"
					icon-id="trash"
					icon-style="fas"
					kind="danger"
					label="Deletar"
					role="button"
					@click="deleteItem">
				</lsm-button>
			</div>

		</template>

	</lsm-modal>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmModal from "../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";

export default defineComponent({
	"name": "TheEventDeleteConfirmation",
	"components": {
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"confirmString": ""
		};
	},
	"computed": {

		isFormInvalid () {
			return !this.confirmString || (this.confirmString.toUpperCase() !== "REMOVER");
		},

		selectedEvent () {
			return this.$store.getters["events/selectedEvent"];
		},

		isDocumentExistent () {
			return this.selectedEvent && this.selectedEvent.id;
		}
	},
	"methods": {

		goToEventsHome () {
			return this.$router.push({ "name": "app.events" });
		},

		async deleteItem () {
			this.isLoading = true;
			await this.$store.dispatch("events/deleteEvent", this.selectedEvent.id);
			this.isLoading = false;
			return this.goToEventsHome();
		}
	},

	async created () {
		if (!this.selectedEvent) {
			this.isLoading = true;

			let event = await this.$store.dispatch("events/retrieveEventById", this.$route.params.eventId);
			if (event) {
				this.$store.commit(
					"events/selectedEvent",
					event
				);
				this.isLoading = false;
			} else {
				return await this.$router.replace({ "name": "app.events" });
			}
		}
	},

	unmounted () {
		this.$store.commit("events/unsetSelectedEvent");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
