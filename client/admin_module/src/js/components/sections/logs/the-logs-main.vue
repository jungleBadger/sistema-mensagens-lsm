<template>
	<section
		aria-label="Logs de ações do sistema"
		class="w-full h-full p-2 overflow-hidden flex flex-col">

		<header class="h-12">
			<h2>Log de operações do sistema</h2>
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
				sorting-field="createdAt"
				sorting-direction="desc"
				@paginate="updatePagination">
			</lsm-table>
		</main>


	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
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
		tableColumns() {
			return this.$store.getters["logs/tableColumns"];
		}
	},
	"methods": {
		updatePagination(value) {
			this.pagination = value;
		}
	},
	async beforeMount () {
		await Promise.all([
			this.$store.dispatch("logs/retrieveTotalLogsCount"),
			this.$store.dispatch("logs/retrieveLogs")
		]);
	},
	setup() {
		return {
			...useI18n()
		}
	},

	"watch": {
		async pagination() {
			await Promise.all([
				this.$store.dispatch("logs/retrieveTotalLogsCount"),
				this.$store.dispatch("logs/retrieveLogs")
			]);
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
