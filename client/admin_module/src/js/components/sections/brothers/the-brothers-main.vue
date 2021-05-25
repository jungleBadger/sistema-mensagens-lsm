<template>
	<section
		aria-label="Irmãos registrados no sistema"
		class="w-full h-full overflow-hidden flex flex-col relative">

		<header class="flex mb-3 pl-2 pr-2 pt-2 flex-col md:flex-row md:pl-0 md:pr-0 md:pt-2 gap-2">
			<div class="flex flex-col gap-2 flex-1">

				<h3 class="text-2xl">Gerenciamento de Irmãos</h3>
				<h4 class="text-l">
					Irmãos são utilizados para o registro de <router-link class="text-blue-700" :to="{'name': 'app.events'}">Mensagens</router-link>.
				</h4>
			</div>

			<lsm-button
				label="Criar Irmão"
				class="w-40 h-10 self-end"
				icon-style="fas"
				icon-id="plus"
				@click="openCreateModal">
			</lsm-button>
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Irmãos">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalBrothersCount"
				:items-per-page="pagination.limit"
				:table-items="brothers"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				order-by="NOME_EXIBICAO"
				order-direction="ASC"
				enable-delete-button
				@paginate="updatePagination"
				@deleteRequest="openDeleteModal"
				@select="selectItem"
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
	"name": "TheBrothersMain",
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
		totalBrothersCount() {
			return this.$store.getters["brothers/totalBrothersCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["brothers/pagination"];
			},
			set(val) {
				this.$store.commit("brothers/pagination", val);
			}
		},

		brothers() {
			return this.$store.getters["brothers/brotherItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["brothers/isLoading"];
			},
			set(val) {
				this.$store.commit("brothers/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["brothers/tableColumns"];
		}
	},
	"methods": {

		openCreateModal() {
			this.$router.push(
				{
					"name": "app.brothers.details",
					"params": {
						"brotherId": "novo"
					}
				}
			)
		},

		selectItem(item) {
			this.$store.commit("brothers/selectedBrother", item);
			this.$router.push(
				{
					"name": "app.brothers.details",
					"params": {
						"brotherId": item.id
					}
				}
			)
		},

		openDeleteModal(item) {
			this.$store.commit("brothers/selectedBrother", item);
			this.$router.push(
				{
					"name": "app.brothers.delete",
					"params": {
						"brotherId": item.id
					}
				}
			)
		},

		async loadBrothers() {
			return await Promise.all([
				this.$store.dispatch("brothers/retrieveTotalBrothersCount"),
				this.$store.dispatch("brothers/retrieveBrothers")
			]);
		},

		async searchBrothers() {
			return await this.$store.dispatch(
				"brothers/searchBrothers",
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
			await (this.asyncFilterText ? this.searchBrothers() : this.loadBrothers());
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
		await this.loadBrothers();
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
