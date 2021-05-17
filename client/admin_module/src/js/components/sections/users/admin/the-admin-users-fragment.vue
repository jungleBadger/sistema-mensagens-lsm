<template>
	<main
		class="w-full flex-1 overflow-hidden"
		role="main"
		aria-label="Tabela de Irmãos">

			<lsm-table
				:is-async-search-enabled="true"
				:total-items-count="totalAdminUsersCount"
				:items-per-page="pagination.limit"
				:table-items="adminUsers"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				order-by="CRIADO_EM"
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
	"name": "TheAdminUsersFragment",
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
		totalAdminUsersCount() {
			return this.$store.getters["users/admin/totalAdminUsersCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["users/admin/pagination"];
			},
			set(val) {
				this.$store.commit("users/admin/pagination", val);
			}
		},

		adminUsers() {
			return this.$store.getters["users/admin/adminUserItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["users/admin/isLoading"];
			},
			set(val) {
				this.$store.commit("users/admin/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["users/admin/tableColumns"];
		}
	},
	"methods": {

		openCreateModal() {
			this.$router.push(
				{
					"name": "app.users.admin.details",
					"params": {
						"adminUserId": "novo"
					}
				}
			)
		},

		selectItem(item) {
			this.$store.commit("users/admin/selectedAdminUser", item);
			this.$router.push(
				{
					"name": "app.users.admin.details",
					"params": {
						"adminUserId": item.id
					}
				}
			)
		},

		async loadAdminUsers() {
			return await Promise.all([
				this.$store.dispatch("users/admin/retrieveTotalAdminUsersCount"),
				this.$store.dispatch("users/admin/retrieveAdminUsers")
			]);
		},

		async searchAdminUsers() {
			return await this.$store.dispatch(
				"users/admin/searchAdminUsers",
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
			await (this.asyncFilterText ? this.searchAdminUsers() : this.loadAdminUsers());
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
		await this.loadAdminUsers()
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
