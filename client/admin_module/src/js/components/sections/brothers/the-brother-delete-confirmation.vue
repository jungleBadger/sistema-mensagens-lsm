<template>
	<lsm-modal

		@close="goToBrothersHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
				<template v-if="isDocumentExistent">
					Remover Irmão {{ selectedBrother.displayName }}
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
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";

export default defineComponent({
	"name": "TheBrotherDeleteConfirmation",
	"components": {
		LsmInput,
		LsmButton,
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

		selectedBrother () {
			return this.$store.getters["brothers/selectedBrother"];
		},
		isDocumentExistent () {
			return this.selectedBrother && this.selectedBrother.id;
		}

	},
	"methods": {
		goToBrothersHome () {
			return this.$router.push({ "name": "app.brothers" });
		},

		async deleteItem() {
			this.isLoading = true;
			await this.$store.dispatch("brothers/deleteBrother", this.selectedBrother.id);
			this.isLoading = false;
			return this.goToBrothersHome();
		}
	},

	async created () {
		if (!this.selectedBrother) {
			this.isLoading = true;

			let brother = await this.$store.dispatch("brothers/retrieveBrotherById", this.$route.params.brotherId);
			if (brother) {
				this.$store.commit(
					"brothers/selectedBrother",
					brother
				);
				this.isLoading = false;
			} else {
				return await this.$router.replace({ "name": "app.brothers" });
			}
		}
	},

	unmounted () {
		this.$store.commit("brothers/unsetSelectedBrother");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
