<template>
	<section
		aria-label="Administração de categorias"
		class="w-full h-full overflow-hidden flex flex-col relative">
		<header class="flex mb-3 pl-2 pr-2 pt-0 flex-col md:flex-row md:pl-0 md:pr-0  gap-2">
			<div class="flex flex-col gap-0 flex-1">

				<h3 class="text-2xl">Gerenciamento de Categorias</h3>
				<h4 class="text-l">
					Categorias são utilizadas para o registro de <router-link class="text-blue-700" :to="{'name': 'app.events'}">Eventos</router-link>.
				</h4>

			</div>
			<lsm-button
				label="Criar Categoria"
				class="w-40 h-10 self-end"
				icon-style="fas"
				icon-id="plus"
				:href="{
					'name': 'app.categories.details',
					'params': {'categoryId': 'novo'}
				}">
			</lsm-button>
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Irmãos">

			<lsm-table
				enable-delete-button
				:is-async-search-enabled="true"
				:total-items-count="totalCategoriesCount"
				:items-per-page="pagination.limit"
				:table-items="categories"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				order-by="NOME"
				order-direction="ASC"
				@paginate="updatePagination"
				@select="selectItem"
				@deleteRequest="openDeleteModal"
				@search="handleAsyncSearch">
			</lsm-table>
		</main>


		<router-view
			v-slot="{ Component }">
			<transition
				@enter="fadeIn"
				@leave="fadeOut"
				mode="out-in"
				:css="false">
				<component :is="Component" />
			</transition>
		</router-view>

	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../_etc/shared_components/ui/lsm-table.vue";
import fade from "../../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheCategoriesMain",
	"mixins": [
		fade
	],
	"components": {
		LsmButton,
		LsmTable
	},
	"data": function () {
		return {
			"asyncFilterColumn": "",
			"asyncFilterText": ""
		}
	},

	"computed": {
		totalCategoriesCount() {
			return this.$store.getters["categories/totalCategoriesCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["categories/pagination"];
			},
			set(val) {
				this.$store.commit("categories/pagination", val);
			}
		},

		categories() {
			return this.$store.getters["categories/categoryItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["categories/isLoading"];
			},
			set(val) {
				this.$store.commit("categories/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["categories/tableColumns"];
		}
	},
	"methods": {

		selectItem(item) {
			this.$store.commit("categories/selectedCategory", item);
			this.$router.push(
				{
					"name": "app.categories.details",
					"params": {
						"categoryId": item.id
					}
				}
			)
		},

		openDeleteModal(item) {
			this.$store.commit("categories/selectedCategory", item);
			this.$router.push(
				{
					"name": "app.categories.delete",
					"params": {
						"categoryId": item.id
					}
				}
			)
		},


		async loadCategories() {
			return await Promise.all([
				this.$store.dispatch("categories/retrieveTotalCategoriesCount"),
				this.$store.dispatch("categories/retrieveCategories")
			]);
		},

		async searchCategories() {
			return await this.$store.dispatch(
				"categories/searchCategories",
				{
					"filterColumn": this.asyncFilterColumn,
					"filterText": this.asyncFilterText
				}
			);
		},

		async performRelevantQuery() {
			if (this.isLoading) {
				return false;
			}
			this.isLoading = true;
			await (this.asyncFilterText ? this.searchCategories() : this.loadCategories());
			this.isLoading = false;
		},

		updatePagination(value) {
			this.pagination = value;
			return this.performRelevantQuery();
		},

		handleAsyncSearch(value) {

			this.asyncFilterColumn = value.filteringField;
			this.asyncFilterText = value.filteringValue;
			this.pagination = {
				...this.pagination,
				"skip": 0
			};

			return this.performRelevantQuery();
		}



	},

	async created () {
		this.isLoading = true;
		await this.loadCategories();
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
