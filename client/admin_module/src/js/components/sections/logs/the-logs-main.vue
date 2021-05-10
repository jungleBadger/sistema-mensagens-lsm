<template>
	<section
		aria-label="Logs de ações do sistema"
		class="w-full h-full p-2 overflow-hidden flex flex-col">

		<header class="min-h-12 mb-4">
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
				:total-items-count="totalLogsCount"
				:items-per-page="pagination.limit"
				:table-items="logs"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				sorting-direction="desc"
				@paginate="updatePagination">
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
		updatePagination(value) {
			this.pagination = value;
		},
		async loadLogs() {
			this.isLoading = true;
			await Promise.all([
				this.$store.dispatch("logs/retrieveTotalLogsCount"),
				this.$store.dispatch("logs/retrieveLogs")
			]);
			this.isLoading = false;
		}
	},
	async beforeMount () {
		await this.loadLogs();
	},

	"watch": {
		async pagination() {
			if (!this.isLoading) {
				await this.loadLogs();
			}

		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
