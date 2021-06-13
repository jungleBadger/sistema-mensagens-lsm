<template>
	<div class="w-full h-full bg-red-500 pl-8 pr-8">
		Minhas mensagens
		<div>
			<h3>Pendente</h3>
			{{pendingOrders}}
		</div>
		<div>
			<h3>Processadas</h3>
			{{processedOrders}}
		</div>
		<div>
			<h3>Rejeitadas</h3>
			{{rejectedOrders}}
		</div>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";

export default defineComponent({
	"name": "TheOwnedMessages",
	"computed": {
		"pendingOrders": function () {
			return this.$store.getters["orders/pending/orders"];
		},
		"processedOrders": function () {
			return this.$store.getters["orders/processed/orders"];
		},
		"rejectedOrders": function () {
			return this.$store.getters["orders/rejected/orders"];
		}

	},
	async beforeCreate () {
		await Promise.all([
			this.$store.dispatch("orders/pending/fetchPendingOrders"),
			this.$store.dispatch("orders/processed/fetchProcessedOrders"),
			this.$store.dispatch("orders/rejected/fetchRejectedOrders")
		]);
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
