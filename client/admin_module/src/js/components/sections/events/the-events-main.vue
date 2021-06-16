<template>
	<section
		aria-label="Irmãos registrados no sistema"
		class="w-full h-full overflow-hidden flex flex-col relative">

		<header class="flex mb-3 pl-2 pr-2 pt-0 flex-col md:flex-row md:pl-0 md:pr-0 gap-2">
			<div class="flex flex-col gap-0 flex-1">


				<h3 class="text-2xl">Gerenciamento de Eventos</h3>
				<h4 class="text-l">
					Eventos agrupam mensagens e proporcionam uma maneira fácil de atualizar o conteúdo.
				</h4>
			</div>

			<lsm-button
				label="Criar Evento"
				class="w-40 h-10 self-end"
				icon-style="fas"
				icon-id="plus"
				:to="{
					'name': 'app.events.details',
					'params': {'eventId': 'novo'}
				}">
			</lsm-button>
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Eventos">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalEventsCount"
				:items-per-page="pagination.limit"
				:table-items="brothers"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				order-by="CRIADO_EM"
				order-direction="DESC"
				enable-delete-button
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
	"name": "TheEventsMain",
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
		totalEventsCount() {
			return this.$store.getters["events/totalEventsCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["events/pagination"];
			},
			set(val) {
				this.$store.commit("events/pagination", val);
			}
		},

		brothers() {
			return this.$store.getters["events/eventItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["events/isLoading"];
			},
			set(val) {
				this.$store.commit("events/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["events/tableColumns"];
		}
	},
	"methods": {

		selectItem(item) {
			this.$store.commit("events/selectedEvent", item);
			this.$router.push(
				{
					"name": "app.events.details",
					"params": {
						"eventId": item.id
					}
				}
			)
		},

		openDeleteModal(item) {
			this.$store.commit("events/selectedEvent", item);
			this.$router.push(
				{
					"name": "app.events.delete",
					"params": {
						"eventId": item.id
					}
				}
			);
		},



		async loadEvents() {
			return await Promise.all([
				this.$store.dispatch("events/retrieveTotalEventsCount"),
				this.$store.dispatch("events/retrieveEvents")
			]);
		},

		async searchEvents() {
			return await this.$store.dispatch(
				"events/searchEvents",
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
			await (this.asyncFilterText ? this.searchEvents() : this.loadEvents());
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
		await this.loadEvents();
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
