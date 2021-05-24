<template>
	<main
		class="w-full flex-1 overflow-hidden"
		role="main"
		aria-label="Tabela de Usuários comuns">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalRegularUsersCount"
				:items-per-page="pagination.limit"
				:table-items="regularUsers"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
        order-by="ATUALIZADO_EM"
        order-direction="DESC"
				@paginate="updatePagination"
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

</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../../_etc/shared_components/ui/lsm-table.vue";
import fade from "../../../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheRegularUsersFragment",
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
		totalRegularUsersCount() {
			return this.$store.getters["users/regular/totalRegularUsersCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["users/regular/pagination"];
			},
			set(val) {
				this.$store.commit("users/regular/pagination", val);
			}
		},

		regularUsers() {
			return this.$store.getters["users/regular/regularUserItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["users/regular/isLoading"];
			},
			set(val) {
				this.$store.commit("users/regular/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["users/regular/tableColumns"];
		}
	},
	"methods": {

		selectItem(item) {
			this.$store.commit("users/regular/selectedRegularUser", item);
			this.$router.push(
				{
					"name": "app.users.regular.details",
					"params": {
						"userId": item.id
					}
				}
			)
		},

		async loadRegularUsers() {
			return await Promise.all([
				this.$store.dispatch("users/regular/retrieveTotalRegularUsersCount"),
				this.$store.dispatch("users/regular/retrieveRegularUsers")
			]);
		},

		async searchRegularUsers() {
			return await this.$store.dispatch(
				"users/regular/searchRegularUsers",
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
			await (this.asyncFilterText ? this.searchRegularUsers() : this.loadRegularUsers());
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
		await this.loadRegularUsers()
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
