<template>
	<lsm-modal

		@close="goToEventsHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Evento {{ selectedEvent.id }}
				</template>
				<template v-else>
					Criar novo Evento
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-80 flex flex-col gap-1 h-20">
				<label class="text-gray-700 ">Título</label>

				<lsm-input
					v-model="title"
					@keyup.enter="submitForm"
					autofocus
					placeholder="Digite o título">

				</lsm-input>
			</div>

		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-4">
				<lsm-button
					v-if="isDocumentExistent"
					:disabled="isLoading"
					:is-loading="isDeleteLoading"
					class="w-24 bg-red-400"
					icon-id="trash"
					icon-style="fas"
					label="Deletar"
					role="button"
					kind="danger"
					@click="deleteItem">
				</lsm-button>
				<lsm-button
					:disabled="isFormInvalid"
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
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmModal from "../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheEventDetails",
	"components": {
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"title": ""
		};
	},
	"computed": {
		isFormInvalid() {
			return !this.title || this.isDeleteLoading;
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

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("events/updateEvent", {
					"id": this.selectedEvent.id,
					"title": this.title
				});
			} else {
				await this.$store.dispatch("events/createEvent", this.title);
				await Promise.all([
					this.$store.dispatch("events/retrieveTotalEventsCount"),
					this.$store.dispatch("events/retrieveEvents")
				]);
			}

			this.isLoading = false;
			return this.goToEventsHome();
		},

		async deleteItem() {
			this.isDeleteLoading = true;
			await this.$store.dispatch("events/deleteEvent", this.selectedEvent.id);
			this.isDeleteLoading = false;
			return this.goToEventsHome();
		}
	},

	async created () {
		if (!this.selectedEvent && this.$route.params.eventId !== "novo") {
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

		if (this.selectedEvent) {
			this.title = this.selectedEvent.title;
		}

	},

	unmounted () {
		this.$store.commit("events/unsetSelectedEvent");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
