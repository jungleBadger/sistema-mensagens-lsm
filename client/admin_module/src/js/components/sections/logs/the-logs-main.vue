<template>
	<section
		aria-label="Logs de ações do sistema"
		class="w-full h-full overflow-hidden flex flex-col">

		<header class="min-h-12 mb-3 pl-2 pr-2 md:pl-0 md:pr-0">
			<h3 class="text-2xl ">Log de operações</h3>
			<h4 class="text-l">
				Consulte e visualize todas operações registradas no Sistema LSM.
			</h4>
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Logs">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalLogsCount"
				:items-per-page="pagination.limit"
				:table-items="logs"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				order-by="CRIADO_EM"
				order-direction="desc"
				@paginate="updatePagination"
				@search="handleAsyncSearch">
			</lsm-table>
		</main>


	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../_etc/shared_components/ui/lsm-table.vue";

export default defineComponent({
	"name": "TheLogsMain",
	"components": {
		LsmTable
	},
	"data": function () {
		return {
			"asyncFilterColumn": "",
			"asyncFilterText": ""
		}
	},
	"computed": {
		totalLogsCount() {
			return this.$store.getters["logs/totalLogsCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["logs/pagination"];
			},
			set(val) {
				this.$store.commit("logs/pagination", val);
			}
		},

		logs() {
			return this.$store.getters["logs/logItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["logs/isLoading"];
			},
			set(val) {
				this.$store.commit("logs/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["logs/tableColumns"];
		}
	},
	"methods": {



		async loadLogs() {
			return await Promise.all([
				this.$store.dispatch("logs/retrieveTotalLogsCount"),
				this.$store.dispatch("logs/retrieveLogs")
			]);
		},

		async searchLogs() {
			return await this.$store.dispatch(
				"logs/searchLogs",
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
			await (this.asyncFilterText ? this.searchLogs() : this.loadLogs());
			this.isLoading = false;
		},

		updatePagination(value) {
			this.pagination = value;
			return this.performRelevantQuery();
		},

		async handleAsyncSearch(value) {
			this.asyncFilterColumn = value.filteringField;
			this.asyncFilterText = value.filteringValue;
			this.pagination = {
				...this.pagination,
				"skip": 0
			};

			return this.performRelevantQuery();

		}
	},
	async created() {
		this.isLoading = true;
		await this.loadLogs();
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
