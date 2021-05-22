<template>
	<lsm-modal

		class="md:w-4/6 h-auto"
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


			<div class="flex flex-col">
				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Título</label>

					<lsm-input
						v-model="title"
						autofocus
						placeholder="Digite o título">

					</lsm-input>
				</div>


				<div class="w-80 flex flex-col gap-1 h-20" :key="parsedDate">
					<label class="text-gray-700 ">Data início</label>
					<litepie-datepicker
						v-model="testVal2"
						as-single
						use-range>
						<lsm-input :model-value="parsedDate"></lsm-input>
					</litepie-datepicker>
				</div>

				<div class="flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Localidade</label>
					<div class="flex gap-1">
						<div class="w-80">
							<lsm-select
								v-model="locationId"
								:options="locations">

							</lsm-select>
						</div>

						<router-link
							:to="{'name': 'app.locations'}"
							class="group relative py-2 px-4 border flex justify-between items-center
							text-blue-600
		border-transparent text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 transition-colors">Gerenciar localidades
						</router-link>
					</div>

				</div>


				<div class="flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Categoria</label>
					<div class="flex gap-1">
						<div class="w-80">
							<lsm-select
								v-model="categoryId"
								:options="categories">

							</lsm-select>
						</div>

						<router-link
							:to="{'name': 'app.categories'}"
							class="group relative py-2 px-4 border flex justify-between items-center
							text-blue-600
		border-transparent text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 transition-colors">Gerenciar categorias
						</router-link>
					</div>

				</div>


				<div class="w-80 flex flex-col gap-1 h-20 mb-4">
					<label class="text-gray-700 ">Descrição</label>

					<lsm-text-area
						v-model="description"
						class="resize-none"
						placeholder="Digite uma descrição">

					</lsm-text-area>
				</div>
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
					kind="danger"
					label="Deletar"
					role="button"
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

import LitepieDatepicker from "litepie-datepicker";
import LsmModal from "../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import LsmTextArea from "../../../../../../_etc/shared_components/ui/lsm-text-area";
import LsmSelect from "../../../../../../_etc/shared_components/ui/lsm-select";
import dayjs from "dayjs";

export default defineComponent({
	"name": "TheEventDetails",
	"components": {
		LsmSelect,
		LitepieDatepicker,
		LsmTextArea,
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"testVal": "",
			"testVal2": [],
			"locationId": "",
			"categoryId": "",
			"title": "",
			"location": "",
			"description": "",
			"createdAt": ""
		};
	},
	"computed": {
		isFormInvalid () {
			return !this.title || this.isDeleteLoading;
		},

		selectedEvent () {
			return this.$store.getters["events/selectedEvent"];
		},
		isDocumentExistent () {
			return this.selectedEvent && this.selectedEvent.id;
		},
		parsedDate () {
			return this.testVal2.map(date => dayjs(date).format("DD/MM/YYYY")).join(" até ");
		},

		categories () {
			return (this.$store.getters["categories/categoryItems"] || []).map(item => {
				return {
					"id": item.id,
					"label": item.name
				};
			});
		},

		locations () {
			return (this.$store.getters["locations/locationItems"] || []).map(item => {
				return {
					"id": item.id,
					"label": item.mnemonic
				};
			});
		}
	},
	"methods": {
		test (ev) {
			console.log(ev);
		},
		goToEventsHome () {
			return this.$router.push({ "name": "app.events" });
		},

		async submitForm () {
			this.isLoading = true;

			console.log({
				"title": this.title,
				"categoryId": this.categoryId,
				"locationId": this.locationId,
				"startDate": this.testVal2[0],
				"endDate": this.testVal2[1],
				"description": this.description
			});

			if (this.isDocumentExistent) {
				await this.$store.dispatch("events/updateEvent", {
					"id": this.selectedEvent.id,
					"title": this.title,
					"categoryId": this.categoryId,
					"locationId": this.locationId,
					"startDate": this.testVal2[0],
					"endDate": this.testVal2[1],
					"description": this.description
				});
			} else {
				await this.$store.dispatch("events/createEvent", {
					"title": this.title,
					"categoryId": this.categoryId,
					"locationId": this.locationId,
					"startDate": this.testVal2[0],
					"endDate": this.testVal2[1],
					"description": this.description
				});
				await Promise.all([
					this.$store.dispatch("events/retrieveTotalEventsCount"),
					this.$store.dispatch("events/retrieveEvents")
				]);
			}

			this.isLoading = false;
			return this.goToEventsHome();
		},

		async deleteItem () {
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

		if (!this.locations || !this.locations.length) {
			await this.$store.dispatch("locations/retrieveLocations");
		}

		if (!this.categories || !this.categories.length) {
			await this.$store.dispatch("categories/retrieveCategories");
		}

		if (this.selectedEvent) {
			this.title = this.selectedEvent.title;
			this.testVal2[0] = dayjs(this.selectedEvent.startDate);
			this.testVal2[1] = dayjs(this.selectedEvent.endDate);
			this.location = this.selectedEvent.location;
			this.locationId = this.selectedEvent.locationId;
			this.categoryId = this.selectedEvent.categoryId;
			this.description = this.selectedEvent.description;
			this.createdAt = this.selectedEvent.createdAt;
		}

	},

	unmounted () {
		this.$store.commit("events/unsetSelectedEvent");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
