<template>
	<div
		style="flex-basis: 40px;"
		class="flex gap-2 w-full">

		<div class="flex flex-1 ">
			<span class="font-mono">
				{{messageIndex}}
			</span>
			<span class="overflow-hidden break-all">
				{{message.title}}
			</span>
		</div>


		<div v-if="isLoggedIn">
			<lsm-button
				kind="danger"
				v-if="isAlreadyInCart"
				label="Remover do carrinho"
				@click="removeItemFromCart"
			></lsm-button>
			<lsm-button
				v-else
				label="Adicionar ao carrinho"
				@click="addItemToCart"></lsm-button>
		</div>

	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "MessageItem",
	components: { LsmButton },
	"props": {
		"message": {
			"type": Object,
			"required": true
		},
		"messageIndex": {
			"type": Number,
			"required": true
		}
	},
	"computed": {
		"currentCart": function () {
			return this.$store.getters["shoppingCart/currentCart"];
		},
		"isLoggedIn": function () {
			return this.$store.getters["utilities/userInfo"].id;
		},
		"isAlreadyInCart": function () {
			return this.currentCart.find(orderItem => orderItem.messageId === this.message.id);
		}
	},
	"methods": {
		async addItemToCart() {
			await this.$store.dispatch("shoppingCart/addItemToCart", this.message.id);
		},
		async removeItemFromCart() {
			await this.$store.dispatch("shoppingCart/removeItemFromCart", this.isAlreadyInCart.orderItemId);
		}
	},
	async mounted () {
		console.log("retrieve status");
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
