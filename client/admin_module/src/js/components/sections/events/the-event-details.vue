<template>
	<aside
		class="w-full h-full absolute left-0 top-0 border-0 m-0 p-0 z-50">
		<lsm-modal
			:is-loading="isLoading"
			class="h-auto"
			@close="goToEventsHome">

			<template v-slot:modal-header>
				<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
					<template v-if="isDocumentExistent">
						Editar Evento '{{ selectedEvent.title }}'
					</template>
					<template v-else>
						Criar novo Evento
					</template>
				</h3>
			</template>

			<template v-slot:modal-content>

				<div
					class="w-full flex flex-col lg:flex-row divide-y divide-x-0 lg:divide-y-0 lg:divide-x overflow-hidden gap-2">

					<div class="flex flex-col pr-2 gap-2">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Título</label>

							<lsm-text-area
								v-model="title"
								autofocus
								max-length="512"
								placeholder="Digite o título">

							</lsm-text-area>
						</div>


						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Período do evento</label>
							<litepie-datepicker
								v-model="datesStructure"
								as-single
								i18n="pt-br"
								use-range>
								<lsm-input
									:model-value="parsedDate"
									placeholder="Selecione data início e data fim"></lsm-input>
							</litepie-datepicker>
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-gray-700 ">Localidade</label>
							<div class="flex gap-2 flex-wrap">
								<div class="w-80">
									<lsm-select
										v-model="locationId"
										:options="locations">
									</lsm-select>
								</div>


								<router-link
									:to="{'name': 'app.locations'}"
									class="h-10 group relative py-2 px-2 border flex justify-between items-center
									text-blue-600 border w-44 hover:bg-gray-300 active:bg-gray-400 transition-colors
									text-sm font-medium rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
									focus:ring-indigo-500 transition-colors">
									<span>
										Gerenciar localidades
									</span>
									<font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
								</router-link>

							</div>

						</div>


						<div class="flex flex-col gap-1">
							<label class="text-gray-700 ">Categoria</label>
							<div class="flex gap-2 flex-wrap">
								<div class="w-80">
									<lsm-select
										v-model="categoryId"
										:options="categories">

									</lsm-select>
								</div>

								<router-link
									:to="{'name': 'app.categories'}"
									class="h-10 group relative py-2 px-2 border flex justify-between items-center
									text-blue-600 border w-44 hover:bg-gray-300 active:bg-gray-400 transition-colors
									text-sm font-medium rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
									focus:ring-indigo-500 transition-colors">
									<span>
										Gerenciar categorias
									</span>
									<font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
								</router-link>
							</div>
						</div>


						<div class="w-full md:w-80 flex flex-col gap-1 mb-6">
							<label class="text-gray-700 ">Descrição</label>

							<lsm-text-area
								v-model="description"
								max-length="1024"
								placeholder="Digite uma descrição"
								rows="4">

							</lsm-text-area>
						</div>
					</div>


					<div class="flex-1 pl-2 overflow-auto">


						<the-message-list
							v-if="selectedEvent"
							:event-id="selectedEvent.id"
						></the-message-list>
						<div
							class="bg-white p-2 shadow-sm "
							v-else>
							Crie o evento para adicionar mensagens.
						</div>

					</div>

				</div>


			</template>

			<template v-slot:modal-footer>
				<div class="w-full h-9 flex items-center justify-end gap-2">

					<lsm-button
						kind="tertiary"
						label="Cancelar"
						@click="goToEventsHome">
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

		<router-view
			v-slot="{ Component }">
			<transition
				:css="false"
				mode="out-in"
				@enter="fadeIn"
				@leave="fadeOut">
				<component
					:is="Component"/>
			</transition>
		</router-view>

	</aside>


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
import TheMessageList from "./messages/the-message-list";
import fade from "../../../../../../_etc/shared_mixins/fade";

export default defineComponent({
	"name": "TheEventDetails",
	"mixins": [
		fade
	],
	"components": {
		TheMessageList,
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
			"datesStructure": [],
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
			return !this.title;
		},

		selectedEvent () {
			return this.$store.getters["events/selectedEvent"];
		},
		isDocumentExistent () {
			return this.selectedEvent && this.selectedEvent.id;
		},
		parsedDate () {
			return this.datesStructure.map(date => dayjs(date).format("DD/MM/YYYY")).join(" até ");
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
		goToEventsHome () {
			return this.$router.push({ "name": "app.events" });
		},

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("events/updateEvent", {
					"id": this.selectedEvent.id,
					"title": this.title,
					"categoryId": this.categoryId,
					"locationId": this.locationId,
					"startDate": dayjs(this.datesStructure[0]).startOf("day"),
					"endDate": dayjs(this.datesStructure[1]).endOf("day"),
					"description": this.description
				});
				return this.goToEventsHome();
			} else {
				let newEvent = await this.$store.dispatch("events/createEvent", {
					"title": this.title,
					"categoryId": this.categoryId,
					"locationId": this.locationId,
					"startDate": dayjs(this.datesStructure[0]).startOf("day"),
					"endDate": dayjs(this.datesStructure[1]).endOf("day"),
					"description": this.description
				});
				await Promise.all([
					this.$store.dispatch("events/retrieveTotalEventsCount"),
					this.$store.dispatch("events/retrieveEvents"),
					this.$router.replace({
						"name": "app.events.details",
						"params": {
							"eventId": newEvent.ID
						}
					})
				]);

			}

			this.isLoading = false;

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

		await Promise.all([
			this.$store.dispatch("locations/retrieveLocations", {
				"skip": 0,
				"limit": 100
			}),
			this.$store.dispatch("categories/retrieveCategories", {
				"skip": 0,
				"limit": 100
			})
		]);

		if (this.selectedEvent) {
			this.title = this.selectedEvent.title;
			this.datesStructure[0] = dayjs(this.selectedEvent.startDate);
			this.datesStructure[1] = dayjs(this.selectedEvent.endDate);
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
