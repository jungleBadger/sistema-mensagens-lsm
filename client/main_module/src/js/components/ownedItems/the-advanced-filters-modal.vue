<template>
	<aside style="z-index: 52;">
		<lsm-modal

			@close="closeAdvancedFiltersModal">

			<template v-slot:modal-header>
				<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis"
					style="max-width: calc(100% - 48px);">
					Filtros avançados
				</h3>
			</template>

			<template v-slot:modal-content>


				<div

					class="flex flex-col gap-2 w-full px-4 py-2">

					<div class="flex flex-col gap-1">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Título do Evento</label>
							<lsm-text-area
								autofocus
								v-model="localEventTitle"
								max-length="512"
								placeholder="Digite parte do título do evento">
							</lsm-text-area>
						</div>
					</div>
					<div class="flex flex-col gap-1">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Título da Mensagem</label>
							<lsm-text-area
								v-model="localMessageTitle"
								max-length="512"
								placeholder="Digite parte do título da mensagem">
							</lsm-text-area>
						</div>
					</div>

					<div class="flex flex-col gap-1">
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
					</div>

					<div class="flex flex-col gap-1">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Irmãos</label>
							<multiselect
								v-model="localSelectedBrothers"
								:multiple="true"
								:options="brothers"
								class="placeholder-gray-50"
								label="NOME_EXIBICAO"
								placeholder="Clique para selecionar irmãos"
								trackBy="ID">
							</multiselect>
						</div>
					</div>


					<div class="flex flex-col gap-1">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700">Categorias</label>
							<multiselect
								v-model="localSelectedCategories"
								:multiple="true"
								:options="categories"
								label="NOME"
								placeholder="Clique para selecionar categorias"
								trackBy="ID">
							</multiselect>
						</div>
					</div>


					<div class="flex flex-col gap-1">
						<div class="w-full md:w-80 flex flex-col gap-1">
							<label class="text-gray-700 ">Cidades</label>
							<multiselect
								v-model="localSelectedLocations"
								:multiple="true"
								:options="locations"
								label="LOCALIDADE"
								placeholder="Clique para selecionar cidades"
								trackBy="ID">
							</multiselect>
						</div>
					</div>


				</div>

			</template>

			<template v-slot:modal-footer>
				<div class="w-full h-10 flex items-center justify-end gap-2">

					<lsm-button
						kind="tertiary"
						label="Cancelar"
						@click="closeAdvancedFiltersModal">
					</lsm-button>


					<lsm-button
						class="w-32"
						label="Reiniciar filtros"
						kind="secondary"
						role="button"
						@click="resetFilters">
					</lsm-button>

					<lsm-button
						class="w-32"
						icon-id="check"
						icon-style="fas"
						label="Aplicar filtros"
						role="button"
						@click="applyFilters">
					</lsm-button>
				</div>

			</template>

		</lsm-modal>

	</aside>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmModal from "../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";
import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input";
import dayjs from "dayjs";
import LitepieDatepicker from "litepie-datepicker";
import Multiselect from "@suadelabs/vue3-multiselect";
import LsmTextArea from "../../../../../_etc/shared_components/ui/lsm-text-area";
import LsmCheckbox from "../../../../../_etc/shared_components/ui/lsm-checkbox";

export default defineComponent({
	"name": "TheAdvancedFiltersModal",
	"components": {
		LsmCheckbox,
		LsmTextArea,
		LsmInput,
		LsmButton,
		LsmModal,
		LitepieDatepicker,
		Multiselect
	},
	"data": function () {
		return {
			"localOwnedOnly": true,
			"localEventTitle": "",
			"localMessageTitle": "",
			"datesStructure": [],
			"localSelectedBrothers": [],
			"localSelectedCategories": [],
			"localSelectedLocations": []
		};
	},
	"computed": {

		"isLoggedIn": function () {
			return this.$store.getters["utilities/userInfo"].id;
		},

		"isFormValid": function () {
			return (
				this.localEventTitle || this.localMessageTitle || this.datesStructure.length ||
				this.localSelectedBrothers.length || this.localSelectedCategories.length ||
				this.localSelectedLocations.length
			);
		},

		brothers () {
			return this.$store.getters["advancedFilters/brothers"];
		},

		categories () {
			return this.$store.getters["advancedFilters/categories"];
		},

		locations () {
			return this.$store.getters["advancedFilters/locations"];
		},

		"useAdvancedSearch": {
			get () {
				return this.$store.getters["advancedFilters/useAdvancedSearch"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/useAdvancedSearch", val);
			}
		},

		"eventTitle": {
			get () {
				return this.$store.getters["advancedFilters/eventTitle"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/eventTitle", val);
			}
		},

		"messageTitle": {
			get () {
				return this.$store.getters["advancedFilters/messageTitle"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/messageTitle", val);
			}
		},

		"startDate": {
			get () {
				return this.$store.getters["advancedFilters/startDate"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/startDate", val);
			}
		},

		"endDate": {
			get () {
				return this.$store.getters["advancedFilters/endDate"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/endDate", val);
			}
		},

		"selectedBrothers": {
			get () {
				return this.$store.getters["advancedFilters/selectedBrothers"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/selectedBrothers", val);
			}
		},

		"selectedCategories": {
			get () {
				return this.$store.getters["advancedFilters/selectedCategories"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/selectedCategories", val);
			}
		},

		"selectedLocations": {
			get () {
				return this.$store.getters["advancedFilters/selectedLocations"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/selectedLocations", val);
			}
		},

		parsedDate () {
			return this.datesStructure.map(date => dayjs(date).format("DD/MM/YYYY")).join(" até ");
		},
		"isAdvancedFiltersModalOpen": {
			get () {
				return this.$store.getters["utilities/isAdvancedFiltersModalOpen"];
			},
			set (val) {
				return this.$store.commit("utilities/isAdvancedFiltersModalOpen", val);
			}
		}
	},
	"methods": {
		resetFilters() {

			this.localOwnedOnly = false;
			this.localEventTitle = "";
			this.localMessageTitle = "";
			this.datesStructure = [];
			this.startDate = "";
			this.endDate = "";
			this.localSelectedBrothers = [];
			this.localSelectedCategories = [];
			this.localSelectedLocations = [];

		},

		closeAdvancedFiltersModal () {

			this.isAdvancedFiltersModalOpen = false;
		},

		applyFilters () {

			if (this.datesStructure && this.datesStructure.length) {
				this.startDate = dayjs(this.datesStructure[0]).startOf("day");
				this.endDate = dayjs(this.datesStructure[1] || this.datesStructure[0]).endOf("day");
			}


			this.ownedOnly = true;
			this.eventTitle = this.localEventTitle;
			this.messageTitle = this.localMessageTitle;
			this.selectedBrothers = this.localSelectedBrothers;
			this.selectedCategories = this.localSelectedCategories;
			this.selectedLocations = this.localSelectedLocations;
			this.useAdvancedSearch = this.isFormValid ? Date.now() : false;

			this.closeAdvancedFiltersModal();
		}

	},

	mounted () {
		if (this.startDate && this.endDate) {
			this.datesStructure = [this.startDate, this.endDate];
		}

		this.localOwnedOnly = true;
		this.localEventTitle = this.eventTitle;
		this.localMessageTitle = this.messageTitle;
		this.localSelectedBrothers = this.selectedBrothers;
		this.localSelectedCategories = this.selectedCategories;
		this.localSelectedLocations = this.selectedLocations;

	}
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
