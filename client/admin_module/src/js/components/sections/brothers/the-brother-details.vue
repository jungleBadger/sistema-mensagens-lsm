<template>
	<lsm-modal

		@close="goToBrothersHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Irmão {{ selectedBrother.id }}
				</template>
				<template v-else>
					Criar novo Irmão
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-80 flex flex-col gap-1">
				<label class="text-gray-700 ">Nome de exibição</label>

				<lsm-text-area
					v-model="displayName"
					@keyup.enter="submitForm"
					autofocus
					max-length="512"
					placeholder="Digite nome de exibição">

				</lsm-text-area>
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
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import LsmTextArea from "../../../../../../_etc/shared_components/ui/lsm-text-area";

export default defineComponent({
	"name": "TheBrotherDetails",
	"components": {
		LsmTextArea,
		LsmButton,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"displayName": ""
		};
	},
	"computed": {
		isFormInvalid() {
			return !this.displayName || this.isDeleteLoading;
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

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("brothers/updateBrother", {
					"id": this.selectedBrother.id,
					"displayName": this.displayName
				});
			} else {
				await this.$store.dispatch("brothers/createBrother", this.displayName);
				await Promise.all([
					this.$store.dispatch("brothers/retrieveTotalBrothersCount"),
					this.$store.dispatch("brothers/retrieveBrothers")
				]);
			}

			this.isLoading = false;
			return this.goToBrothersHome();
		},

		async deleteItem() {
			this.isDeleteLoading = true;
			await this.$store.dispatch("brothers/deleteBrother", this.selectedBrother.id);
			this.isDeleteLoading = false;
			return this.goToBrothersHome();
		}
	},

	async created () {
		if (!this.selectedBrother && this.$route.params.brotherId !== "novo") {
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

		if (this.selectedBrother) {
			this.displayName = this.selectedBrother.displayName;
		}

	},

	unmounted () {
		this.$store.commit("brothers/unsetSelectedBrother");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
