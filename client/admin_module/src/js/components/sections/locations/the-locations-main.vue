<template>
	<section
		aria-label="Localidades registradas no sistema"
		class="w-full h-full overflow-hidden flex flex-col relative">

		<header class="flex mb-3 pl-2 pr-2 pt-2 flex-col md:flex-row md:pl-0 md:pr-0 md:pt-2 gap-2">

			<div class="flex flex-col gap-2 flex-1">

				<h3 class="text-2xl">Gerenciamento de Localidades</h3>
				<h4 class="text-l">
					Localidades são utilizados para o registro de <router-link class="text-blue-700" :to="{'name': 'app.events'}">Eventos</router-link>.
				</h4>
			</div>

			<lsm-button
				label="Criar Localidade"
				class="w-40 h-10 self-end"
				icon-style="fas"
				icon-id="plus"
				:href="{
					'name': 'app.locations.details',
					'params': {'locationId': 'novo'}
				}">
			</lsm-button>
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Localidades">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalLocationsCount"
				:items-per-page="pagination.limit"
				:table-items="locations"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				order-by="PAIS"
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
	"name": "TheLocationsMain",
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
		totalLocationsCount() {
			return this.$store.getters["locations/totalLocationsCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["locations/pagination"];
			},
			set(val) {
				this.$store.commit("locations/pagination", val);
			}
		},

		locations() {
			return this.$store.getters["locations/locationItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["locations/isLoading"];
			},
			set(val) {
				this.$store.commit("locations/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["locations/tableColumns"];
		}
	},
	"methods": {

		selectItem(item) {
			this.$store.commit("locations/selectedLocation", item);
			this.$router.push(
				{
					"name": "app.locations.details",
					"params": {
						"locationId": item.id
					}
				}
			);
		},

		openDeleteModal(item) {
			this.$store.commit("locations/selectedLocation", item);
			this.$router.push(
				{
					"name": "app.locations.delete",
					"params": {
						"locationId": item.id
					}
				}
			);
		},

		async loadLocations() {
			return await Promise.all([
				this.$store.dispatch("locations/retrieveTotalLocationsCount"),
				this.$store.dispatch("locations/retrieveLocations")
			]);
		},

		async searchLocations() {
			return await this.$store.dispatch(
				"locations/searchLocations",
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
			await (this.asyncFilterText ? this.searchLocations() : this.loadLocations());
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
		await this.loadLocations();
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
