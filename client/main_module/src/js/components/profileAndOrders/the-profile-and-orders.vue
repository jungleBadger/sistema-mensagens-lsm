<template>
	<section
		style="background-color: #f9fafb;"
		aria-label="Area do usuário"
		class="w-full h-full overflow-auto flex flex-col relative ">

		<div class="w-full flex flex-col flex-1 relative p-1 md:p-4 gap-12">
			<section>
				<header class="flex mb-3 pl-2 pr-2 pt-0 flex-col md:flex-row md:pl-0 md:pr-0 gap-2">
					<div class="flex flex-col gap-0 flex-1">
						<h3 class="text-2xl">Informações da conta</h3>
						<h4 class="text-l">
							Sua conta é pessoal e intransferível. Com ela você pode explorar o <router-link
							class="text-blue-700"
							:to="{'name': 'app.home'}">catalogo de eventos e mensagens</router-link>.
						</h4>
					</div>

				</header>

				<main
					class="w-full flex-1 overflow-hidden bg-white p-2 shadow rounded"
					role="main"
					aria-label="Detalhes do usuário">

					<div class="w-full flex flex-col gap-1 mb-4">
						<label class="text-gray-700 font-semibold">Email</label>
						{{userInfo.email}}
					</div>

					<div class="w-full flex flex-col gap-1">
						<label class="text-gray-700 font-semibold">Senha</label>
						<span><a
							class="text-blue-700 cursor-pointer"
							href="/auth/reset/" target="_blank">Clique aqui</a> para iniciar processo de troca de senha.</span>
					</div>


				</main>
			</section>

		</div>

		<the-app-footer>

		</the-app-footer>






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

import LsmTable from "../../../../../_etc/shared_components/ui/lsm-table.vue";

import fade from "../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";
import TheAppFooter from "../core/the-app-footer";

export default defineComponent({
	"name": "TheProfileAndOrders",
	"mixins": [
		fade
	],
	"components": {
		TheAppFooter,
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
		"userInfo": function () {
			return this.$store.getters["utilities/userInfo"];
		},
		totalOrdersCount() {
			return this.$store.getters["orders/totalOrdersCount"];
		},
		"pagination": {
			get() {
				return this.$store.getters["orders/pagination"];
			},
			set(val) {
				this.$store.commit("orders/pagination", val);
			}
		},

		orderItems() {
			return this.$store.getters["orders/orderItems"];
		},

		"isLoading": {
			get() {
				return this.$store.getters["orders/isLoading"];
			},
			set(val) {
				this.$store.commit("orders/isLoading", val);
			}
		},
		tableColumns() {
			return this.$store.getters["orders/tableColumns"];
		}
	},
	"methods": {

		async loadOrders() {
			return await Promise.all([
				this.$store.dispatch("orders/retrieveTotalOrdersCount"),
				this.$store.dispatch("orders/retrieveOrders")
			]);
		},

		async searchOrders() {
			return await this.$store.dispatch(
				"orders/searchOrders",
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
			await (this.asyncFilterText ? this.searchOrders() : this.loadOrders());
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
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
