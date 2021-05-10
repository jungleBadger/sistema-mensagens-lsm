<template>
	<section
		aria-label="Irmãos registrados no sistema"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative gap-4">

		<header class="flex gap-4">
			<div class="flex flex-col gap-2 flex-1">

				<h3 class="text-2xl">Gerenciamento de Usuários</h3>
				<h4 class="text-l">
					Usuários do sistema são divididos entre Administradores e Regulares.
				</h4>

			</div>

<!--			<lsm-button-->
<!--				label="Criar Irmão"-->
<!--				class="w-40"-->
<!--				icon-style="fas"-->
<!--				icon-id="plus"-->
<!--				@click="openCreateModal">-->
<!--			</lsm-button>-->
		</header>

		<main
			class="w-full flex-1 overflow-hidden"
			role="main"
			aria-label="Tabela de Irmãos">

<!--			<lsm-table-->
<!--				:total-items-count="totalUsersCount"-->
<!--				:items-per-page="pagination.limit"-->
<!--				:table-items="users"-->
<!--				:columns-data="tableColumns"-->
<!--				:is-async-loading="isLoading"-->
<!--				:handle-click="true"-->
<!--				sorting-direction="asc"-->
<!--				@paginate="updatePagination"-->
<!--				@select="selectItem">-->
<!--			</lsm-table>-->
		</main>


<!--		<router-view-->
<!--			v-slot="{ Component }">-->
<!--			<transition-->
<!--				@enter="fadeIn"-->
<!--				@leave="fadeOut"-->
<!--				mode="out-in"-->
<!--				:css="false">-->
<!--				<component :is="Component" />-->
<!--			</transition>-->
<!--		</router-view>-->


	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../_etc/shared_components/ui/lsm-table.vue";
import fade from "../../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheUsersMain",
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
		// totalUsersCount() {
		// 	return this.$store.getters["users/totalUsersCount"];
		// },
		// "pagination": {
		// 	get() {
		// 		return this.$store.getters["users/pagination"];
		// 	},
		// 	set(val) {
		// 		this.$store.commit("users/pagination", val);
		// 	}
		// },
		//
		// users() {
		// 	return this.$store.getters["users/brotherItems"];
		// },
		// "isLoading": {
		// 	get() {
		// 		return this.$store.getters["users/isLoading"];
		// 	},
		// 	set(val) {
		// 		this.$store.commit("users/isLoading", val);
		// 	}
		// },
		// tableColumns() {
		// 	return this.$store.getters["users/tableColumns"];
		// }
	},
	"methods": {

		// openCreateModal() {
		// 	this.$router.push(
		// 		{
		// 			"name": "app.users.details",
		// 			"params": {
		// 				"brotherId": "novo"
		// 			}
		// 		}
		// 	)
		// },
		//
		// selectItem(item) {
		// 	this.$store.commit("users/selectedUser", item);
		// 	this.$router.push(
		// 		{
		// 			"name": "app.users.details",
		// 			"params": {
		// 				"brotherId": item.id
		// 			}
		// 		}
		// 	)
		// },
		//
		// updatePagination(value) {
		// 	this.pagination = value;
		// },
		// async loadUsers() {
		// 	this.isLoading = true;
		// 	await Promise.all([
		// 		this.$store.dispatch("users/retrieveTotalUsersCount"),
		// 		this.$store.dispatch("users/retrieveUsers")
		// 	]);
		// 	this.isLoading = false;
		// 	return true;
		// }
	},

	// async mounted () {
	// 	await this.loadUsers();
	// },


	// "watch": {
	// 	async pagination() {
	// 		if (!this.isLoading) {
	// 			await this.loadUsers();
	// 		}
	//
	// 	}
	// }
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
