<template>
	<aside style="z-index: 52;">
		<lsm-modal
			@close="closeAdvancedFiltersModal">

			<template v-slot:modal-header>
				<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
					Filtros avançados
				</h3>
			</template>

			<template v-slot:modal-content>

				<div class="flex flex-col">
					<div class="w-96 flex flex-col gap-1">
						<div>
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
					</div>

					<div class="w-96 flex flex-col gap-1">

						<div class="w-96 flex flex-col gap-1">
							<div>
								<div class="w-full md:w-80 flex flex-col gap-1">
									<label class="text-gray-700 ">Irmãos</label>
									<multiselect
										:multiple="true"
										v-model="selectedBrothers"
										placeholder="Clique para selecionar irmãos"
										label="NOME_EXIBICAO"
										trackBy="ID"
										:options="brothers">
									</multiselect>
								</div>
							</div>
						</div>

						<div class="w-96 flex flex-col gap-1">
							<div class="w-full md:w-80 flex flex-col gap-1">
								<label class="text-gray-700">Categorias</label>
								<multiselect
									:multiple="true"
									v-model="selectedCategories"
									placeholder="Clique para selecionar categorias"
									label="NOME"
									trackBy="ID"
									:options="categories">
								</multiselect>
							</div>
						</div>
					</div>

					<div class="w-96 flex flex-col gap-1">
						<div>
							<div class="w-full md:w-80 flex flex-col gap-1">
								<label class="text-gray-700 ">Cidades</label>
								<multiselect
									:multiple="true"
									v-model="selectedLocations"
									placeholder="Clique para selecionar cidades"
									label="LOCALIDADE"
									trackBy="ID"
									:options="locations">
								</multiselect>
							</div>
						</div>
					</div>


				</div>

			</template>

			<template v-slot:modal-footer>
				<div class="w-full h-9 flex items-center justify-end gap-2">

					<lsm-button
						kind="tertiary"
						label="Cancelar">
					</lsm-button>


					<lsm-button
						class="w-32"
						icon-id="check"
						icon-style="fas"
						label="Aplicar filtros"
						role="button">
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

export default defineComponent({
	"name": "TheAdvancedFiltersModal",
	"components": {
		LsmInput,
		LsmButton,
		LsmModal,
		LitepieDatepicker,
		Multiselect
	},
	"data": function () {
		return {
			"datesStructure": [],
			options: ["list", "of", "options"]
		};
	},
	"computed": {


		brothers () {
			return this.$store.getters["advancedFilters/brothers"];
		},

		categories () {
			return this.$store.getters["advancedFilters/categories"];
		},

		locations () {
			return this.$store.getters["advancedFilters/locations"];
		},

		"selectedBrothers": {
			get () {
				return this.$store.getters["advancedFilters/selectedBrothers"];
			},
			set(val) {
				return this.$store.commit("advancedFilters/selectedBrothers", val);
			}
		},

		"selectedCategories": {
			get () {
				return this.$store.getters["advancedFilters/selectedCategories"];
			},
			set(val) {
				return this.$store.commit("advancedFilters/selectedCategories", val);
			}
		},

		"selectedLocations": {
			get () {
				return this.$store.getters["advancedFilters/selectedLocations"];
			},
			set(val) {
				return this.$store.commit("advancedFilters/selectedLocations", val);
			}
		},


		parsedDate () {
			return this.datesStructure.map(date => dayjs(date).format("DD/MM/YYYY")).join(" até ");
		},
		"isAdvancedFiltersModalOpen": {
			get() {
				return this.$store.getters["utilities/isAdvancedFiltersModalOpen"];
			},
			set(val) {
				return this.$store.commit("utilities/isAdvancedFiltersModalOpen", val);
			}
		}
	},
	"methods": {
		closeAdvancedFiltersModal() {
			if (this.datesStructure) {
				console.log(dayjs(this.datesStructure[0]).startOf("day"));
				console.log(dayjs(this.datesStructure[1] || this.datesStructure[0] ).startOf("day"));
			}
			this.isAdvancedFiltersModalOpen = false;
		}

	}
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
