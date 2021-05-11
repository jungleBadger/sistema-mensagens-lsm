<template>
	<main
		class="w-full flex-1 overflow-hidden"
		role="main"
		aria-label="Tabela de Irmãos">

			<lsm-table
				:total-items-count="totalAdminUsersCount"
				:items-per-page="pagination.limit"
				:table-items="adminUsers"
				:columns-data="tableColumns"
				:is-async-loading="isLoading"
				:handle-click="true"
				sorting-direction="asc"
				@paginate="updatePagination"
				@select="selectItem">
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

		}
	},
	"computed": {
		totalAdminUsersCount() {
			return this.$store.getters["adminUsers/totalAdminUsersCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["adminUsers/pagination"];
			},
			set(val) {
				this.$store.commit("adminUsers/pagination", val);
			}
		},

		adminUsers() {
			return this.$store.getters["adminUsers/adminUserItems"];
		},
		"isLoading": {
			get() {
				return this.$store.getters["adminUsers/isLoading"];
			},
			set(val) {
				this.$store.commit("adminUsers/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["adminUsers/tableColumns"];
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
			this.$store.commit("adminUsers/selectedAdminUser", item);
			this.$router.push(
				{
					"name": "app.users.admin.details",
					"params": {
						"adminUserId": item.id
					}
				}
			)
		},

		updatePagination(value) {
			this.pagination = value;
		},
		async loadAdminUsers() {
			this.isLoading = true;
			await Promise.all([
				this.$store.dispatch("adminUsers/retrieveTotalAdminUsersCount"),
				this.$store.dispatch("adminUsers/retrieveAdminUsers")
			]);
			this.isLoading = false;
			return true;
		}
	},

	async mounted () {
		await this.loadAdminUsers();
	},


	"watch": {
		async pagination() {
			if (!this.isLoading) {
				await this.loadAdminUsers();
			}

		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
