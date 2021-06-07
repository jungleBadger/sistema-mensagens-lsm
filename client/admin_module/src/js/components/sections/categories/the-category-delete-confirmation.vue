<template>
	<lsm-modal

		@close="goToCategoriesHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
				<template v-if="isDocumentExistent">
					Remover Categoria '{{ selectedCategory.name }}'
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
	"name": "TheCategoryDeleteConfirmation",
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

		selectedCategory () {
			return this.$store.getters["categories/selectedCategory"];
		},

		isDocumentExistent () {
			return this.selectedCategory && this.selectedCategory.id;
		}
	},
	"methods": {
		goToCategoriesHome () {
			return this.$router.push({ "name": "app.categories" });
		},

		async deleteItem() {
			this.isLoading = true;
			await this.$store.dispatch("categories/deleteCategory", this.selectedCategory.id);
			this.isLoading = false;
			return this.goToCategoriesHome();
		}
	},

	async created () {
		if (!this.selectedCategory) {
			this.isLoading = true;

			let category = await this.$store.dispatch("categories/retrieveCategoryById", this.$route.params.categoryId);

			if (category) {
				this.$store.commit(
					"categories/selectedCategory",
					category
				);
			} else {
				return await this.$router.replace({"name": "app.categories"});
			}
			this.isLoading = false;
		}
	},

	unmounted () {
		this.$store.commit("categories/unsetSelectedCategory");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
