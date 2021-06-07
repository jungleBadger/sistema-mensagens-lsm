<template>
	<lsm-modal

		@close="goToLocationsHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
				<template v-if="isDocumentExistent">
					Remover Localidade '{{ selectedLocation.mnemonic }}'
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
					class="w-28 bg-red-400"
					icon-id="trash"
					icon-style="fas"
					label="Remover"
					role="button"
					kind="danger"
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
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheLocationDeleteConfirmation",
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

		async deleteItem() {
			this.isLoading = true;
			await this.$store.dispatch("locations/deleteLocation", this.selectedLocation.id);
			this.isLoading = false;
			return this.goToLocationsHome();
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
	},

	unmounted () {
		this.$store.commit("locations/unsetSelectedLocation");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
