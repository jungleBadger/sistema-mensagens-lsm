<template>
	<div class="w-full h-full bg-red-500 pl-8 pr-8">
		<header>
			<h6>Carrinho</h6>

		</header>

		<main>
			<template v-if="orderId">
				<lsm-button
					kind="danger"
					label="Limpar carrinho"
					@click="clearCart"></lsm-button>
				<form
					ref="yapayForm"
					id="form_pagamento"
					action="https://tc-intermediador-sandbox.yapay.com.br/payment/transaction"
					method="POST"
					name="form_pagamento"
					target="_self">

					<input
						id="token_account"
						name="token_account"
						type="hidden"
						value="e4438667a6d6e80">

					<input
						id="customer_email"
						name="customer[email]"
						type="hidden"
						:value="loggedUserEmail">


					<template v-if="orderId">
						FORM
						<input
							id="order_number"
							name="order_number"
							type="hidden"
							:value="orderId + 100">

						<template v-for="(item, index) in cartItems" class="flex gap-2">
							<input
								:id="`product_description-${index}`"
								name="transaction_product[][description]"
								type="hidden"
								:value="item.messageTitle">

							<input
								:id="`product_quantity-${index}`"
								name="transaction_product[][quantity]"
								type="hidden"
								value="1">
							<input
								:id="`product_price-${index}`"
								:value="Number(item.appliedValue)"
								name="transaction_product[][price_unit]"
								type="hidden">

							<input
								:id="`product_code-${index}`"
								:value="item.messageId"
								name="transaction_product[][code]"
								type="hidden">

						</template>

					</template>


					<input
						id="url_process"
						name="url_process"
						type="hidden"
						:value="`https://sistema.igrejaemsumare.com.br/pedidos`">

					<input
						id="url_notification"
						name="url_notification"
						type="hidden"
						:value="`https://sistema.igrejaemsumare.com.br/api/order/${orderId}/update`">


				</form>

				<lsm-button
					@click="setOrderToPending"
					label="Proceder para o pagamento"></lsm-button>
			</template>
			<template v-else>
				<h3>Carrinho não possui itens.</h3>
			</template>



		</main>
		{{integrationURL}}
		<div v-for="item in cartItems" class="flex gap-2">
			<span>{{ item.id }}</span>
			<span>{{ item.messageTitle }}</span>
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
	setup() {
		return {
			"integrationURL": `${window.location.protocol || "https:"}//${window.location.host || "localhost:3030"}/`
		}
	},
	"computed": {

		"cartItems": function () {
			return this.$store.getters["shoppingCart/currentCart"];
		},

		"orderId": function () {
			return this.cartItems && this.cartItems[0] ? this.cartItems[0].orderId : "";
		},

		"loggedUserEmail": function () {
			return "danibize@gmail.com";
			// return this.$store.getters["utilities/userInfo"].email;
		}
	},
	"methods": {
		async clearCart () {
			await this.$store.dispatch("shoppingCart/clearCart");
		},

		async setOrderToPending() {
			await this.$store.dispatch("shoppingCart/setOrderToPending", this.orderId);
			this.$refs.yapayForm.submit();
		}
	},
	async mounted() {
		if (this.orderId) {
			await this.$store.dispatch("shoppingCart/validateOrder", this.orderId);
		}

	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
