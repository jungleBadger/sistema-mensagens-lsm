<template>
	<lsm-modal

		@close="goToLocationsHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Localidade {{ selectedLocation.id }}
				</template>
				<template v-else>
					Criar nova Localidade
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>

			<div class="flex flex-col gap-2 w-full">
				<div class="w-full flex flex-col gap-1">
					<label class="text-gray-700 ">País</label>
					<lsm-select
						autofocus
						:options="countries"
						v-model="country">
					</lsm-select>
				</div>

				<div class="w-full flex gap-2">
					<div class="flex-1 flex flex-col gap-1">
						<label class="text-gray-700 ">Estado</label>
						<lsm-input
							v-model="state"
							placeholder="Digite nome do Estado">
						</lsm-input>
					</div>

					<div class="flex-1 flex flex-col gap-1">
						<label class="text-gray-700 ">Cidade</label>
						<lsm-input
							v-model="city"
							@keyup.enter="submitForm"
							placeholder="Digite nome da Cidade">
						</lsm-input>
					</div>
				</div>

				<div class="w-full">
					<div class="w-96 flex flex-col gap-1">
						<label class="text-gray-700 ">Descrição - opcional</label>
						<lsm-text-area
							v-model="description"
							placeholder="Digite a descriçao da localidade">
						</lsm-text-area>
					</div>
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
import countries from "./countries.json";
import LsmSelect from "../../../../../../_etc/shared_components/ui/lsm-select";
import LsmTextArea from "../../../../../../_etc/shared_components/ui/lsm-text-area";

export default defineComponent({
	"name": "TheLocationDetails",
	"components": {
		LsmTextArea,
		LsmSelect,
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"country": "",
			"state": "",
			"city": "",
			"description": ""
		};
	},
	"computed": {
		isFormInvalid() {
			return !this.country || this.isDeleteLoading;
		},

		selectedLocation () {
			return this.$store.getters["locations/selectedLocation"];
		},
		isDocumentExistent () {
			return this.selectedLocation && this.selectedLocation.id;
		}
	},
	"methods": {
		goToLocationsHome () {
			return this.$router.push({ "name": "app.locations" });
		},

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch(
					"locations/updateLocation",
					{
						"id": this.selectedLocation.id,
						"country": this.country,
						"state": this.state,
						"city": this.city,
						"description": this.description
					}
				);
			} else {
				await this.$store.dispatch(
					"locations/createLocation",
					{
						"country": this.country,
						"state": this.state,
						"city": this.city,
						"description": this.description
					}
				);
				await Promise.all([
					this.$store.dispatch("locations/retrieveTotalLocationsCount"),
					this.$store.dispatch("locations/retrieveLocations")
				]);
			}

			this.isLoading = false;
			return this.goToLocationsHome();
		},

		async deleteItem() {
			this.isDeleteLoading = true;
			await this.$store.dispatch("locations/deleteLocation", this.selectedLocation.id);
			this.isDeleteLoading = false;
			return this.goToLocationsHome();
		}
	},

	setup() {
		return {
			countries
		}
	},

	async created () {
		if (!this.selectedLocation && this.$route.params.locationId !== "novo") {
			this.isLoading = true;

			let location = await this.$store.dispatch("locations/retrieveLocationById", this.$route.params.locationId);
			if (location) {
				this.$store.commit(
					"locations/selectedLocation",
					location
				);
				this.isLoading = false;
			} else {
				return await this.$router.replace({ "name": "app.locations" });
			}


		}

		if (this.selectedLocation) {
			this.country = this.selectedLocation.country;
			this.state = this.selectedLocation.state;
			this.city = this.selectedLocation.city;
			this.description = this.selectedLocation.description;
		}

	},

	unmounted () {
		this.$store.commit("locations/unsetSelectedLocation");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
