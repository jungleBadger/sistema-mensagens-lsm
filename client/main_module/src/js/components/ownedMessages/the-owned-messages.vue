<template>
	<div class="w-full h-full bg-red-500 pl-8 pr-8">
		Minhas mensagens
		<div>
			{{pendingOrders}}
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
		}

	},
	async beforeCreate () {
		await this.$store.dispatch("orders/pending/fetchPendingOrdersOrders");
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
