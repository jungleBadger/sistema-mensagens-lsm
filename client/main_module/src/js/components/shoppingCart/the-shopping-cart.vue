<template>
	<div class="w-full h-full bg-red-500 pl-8 pr-8">
		<header>
			<h6>Carrinho</h6>
			<lsm-button
				kind="danger"
				label="Limpar carrinho"
				@click="clearCart"></lsm-button>
		</header>
		<div v-for="item in cartItems" class="flex gap-2">
			<span>{{ item.id }}</span>
			<span>{{ item.messageId }}</span>
			<span>{{ item.appliedValue }}</span>
		</div>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheShoppingCart",
	"components": { LsmButton },
	"computed": {
		"cartItems": function () {
			return this.$store.getters["shoppingCart/currentCart"];
		}
	},
	"methods": {
		async clearCart() {
			await this.$store.dispatch("shoppingCart/clearCart");
		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
