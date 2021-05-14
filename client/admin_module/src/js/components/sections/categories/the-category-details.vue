<template>
	<lsm-modal

		@close="goToCategoriesHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Categoria {{ selectedCategory.id }}
				</template>
				<template v-else>
					Criar nova Categoria
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-80 flex flex-col gap-1 h-20">
				<label class="text-gray-700 ">Nome de exibição</label>

				<lsm-input
					v-model="name"
					@keyup.enter="submitForm"
					autofocus
					placeholder="Digite nome de exibição">

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
	"name": "TheCategoryDetails",
	"components": {
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"name": ""
		};
	},
	"computed": {
		isFormInvalid () {
			return !this.name || this.isDeleteLoading || !this.selectedCategory || (this.name === this.selectedCategory.name);
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

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("categories/updateCategory", {
					"id": this.selectedCategory.id,
					"name": this.name
				});
			} else {
				await this.$store.dispatch("categories/createCategory", this.name);
			}

			await Promise.all([
				this.$store.dispatch("categories/retrieveTotalCategoriesCount"),
				this.$store.dispatch("categories/retrieveCategories")
			]);

			this.isLoading = false;
			return this.goToCategoriesHome();
		},

		async deleteItem() {

			this.isDeleteLoading = true;

			await this.$store.dispatch("categories/deleteCategory", this.selectedCategory.id);

			await Promise.all([
				this.$store.dispatch("categories/retrieveTotalCategoriesCount"),
				this.$store.dispatch("categories/retrieveCategories")
			]);

			this.isDeleteLoading = false;
			return this.goToCategoriesHome();
		}
	},

	async mounted () {
		if (!this.selectedCategory && this.$route.params.categoryId !== "novo") {
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

		}

		if (this.selectedCategory) {
			this.name = this.selectedCategory.name;
		}

	},

	unmounted () {
		this.$store.commit("categories/unsetSelectedCategory");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
