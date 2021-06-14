<template>
	<div
		style="flex-basis: 40px;"
		class="flex gap-2 w-full items-center">

		<header class="flex flex-col flex-1 font-sans-alternative gap-1 text-sm">
			<h5 class="flex flex-1 gap-1">
				<i18n-n
					:value="messageIndex"
					locale="pt"
					format="integer"
					tag="span"
				></i18n-n>
				-
				<span class="overflow-hidden break-all">{{message.title}}</span>
			</h5>
			<h6>
				Por {{message.brotherName}} em <i18n-d
				:value="message.messageDate"
				key="short"
				locale="pt"
				tag="span"
			></i18n-d>
			</h6>
		</header>


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
