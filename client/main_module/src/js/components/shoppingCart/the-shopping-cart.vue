<template>
	<div
		class="w-full h-full px-1 md:px-8 overflow-auto"
		style="background-color: #f9fafb;">

		<main class="p-1 md:p-8">
			<template v-if="orderId">
				<div class="">
					<div class="flex shadow-md rounded flex-wrap">

						<div class="w-full md:w-3/4 rounded-l bg-white px-10 py-4">
							<div class="flex justify-between border-b pb-4 flex-wrap">
								<h1 class="font-semibold text-2xl">Carrinho de compras</h1>
								<h2 class="font-semibold text-2xl flex gap-2 items-center flex-wrap">{{cartItems.length}} Mensagen(s)
									<lsm-button
										kind="danger"
										label="Limpar carrinho"
										@click="clearCart"></lsm-button>
								</h2>
							</div>
							<div class="flex mt-10 mb-5">
								<h3 class="font-semibold text-gray-600 text-xs uppercase w-5/12">Mensagem</h3>
								<h3 class="font-semibold text-gray-600 text-xs uppercase w-5/12">Detalhes</h3>
								<h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-2/12">Preço</h3>
							</div>

							<div
								v-for="item in cartItems"
								:key="item.id"
								class="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">

								<div class="flex w-5/12"> <!-- product -->
									<div class="flex flex-col justify-between ml-3 flex-grow">
										<span class="font-bold text-sm">{{ item.messageTitle }}</span>
										<a
											class="font-semibold text-red-400 hover:text-red-700 text-xs"
											href="#"
											@click="removeItemFromCart(item.orderItemId)">Remover</a>
									</div>
								</div>

								<div class="flex w-5/12"> <!-- product -->
									<div class="flex flex-col justify-between ml-3 flex-grow">
										<span class="font-bold text-sm">{{ item.eventTitle }}</span>
										<a class="text-gray-500 text-xs" href="#">{{ item.brotherName }}</a>
									</div>
								</div>


								<span
									class="text-center w-2/12 font-semibold ml-3 text-sm">R$ {{ item.appliedValue }}</span>

							</div>


						</div>

						<div id="summary" class="w-full rounded-r md:w-1/4 px-8 py-4 bg-gray-300">
							<h1 class="font-semibold text-2xl border-b pb-6">Resumo do pedido</h1>
							<div class="flex justify-between mt-10 mb-5">
								<span class="font-semibold text-sm uppercase">Mensagens: {{cartItems.length}}</span>
								<span class="font-semibold text-sm">R$ {{totalMessagesPrice}}</span>
							</div>

							<div class="border-t mt-8">
								<div class="flex font-semibold justify-between py-6 text-sm uppercase">
									<span>Total</span>
									<span>R$ {{totalMessagesPrice}}</span>
								</div>

								<button
									class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
									@click="setOrderToPending">
									<template v-if="isLoading">
										<font-awesome-icon
											:icon="['fas', 'spinner-third']"
											spin/>
									</template>
									<template v-else>
										<span>Pagar com YaPay</span>
										<font-awesome-icon class="ml-2" :icon="['fas', 'up-right-from-square']"></font-awesome-icon>
									</template>
								</button>
							</div>
						</div>

					</div>
				</div>


				<form
					id="form_pagamento"
					ref="yapayForm"
					action="https://tc-intermediador-sandbox.yapay.com.br/payment/transaction"
					class="hidden"
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
						:value="loggedUserEmail"
						name="customer[email]"
						type="hidden">


					<template v-if="orderId">
						<input
							id="order_number"
							:value="orderId"
							name="order_number"
							type="hidden">

						<template v-for="(item, index) in cartItems" class="flex gap-2">
							<input
								:id="`product_description-${index}`"
								:value="item.messageTitle"
								name="transaction_product[][description]"
								type="hidden">

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
						:value="`https://sistema.igrejaemsumare.com.br/app/minhas-mensagens`"
						name="url_process"
						type="hidden">

					<input
						id="url_notification"
						:value="`https://sistema.igrejaemsumare.com.br/api/order/${orderId}/update`"
						name="url_notification"
						type="hidden">


				</form>


			</template>
			<template v-else>
				<h3 class="bg-white p-8 shadow rounded flex flex-col">
					<span>Carrinho não possui itens.</span><span><router-link
					:to="{'name': 'app.home'}"
					class="text-blue-700">Pesquisar eventos e mensagens.</router-link></span></h3>
			</template>


		</main>


	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmButton from "../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheShoppingCart",
	"components": { LsmButton },
	setup () {
		return {
			"integrationURL": `${window.location.protocol || "https:"}//${window.location.host || "localhost:3030"}/`
		};
	},
	"data": function () {
		return {
			"isLoading": false
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
			return this.$store.getters["utilities/userInfo"].email;
		},

		"totalMessagesPrice": function () {
			return (this.cartItems.map(item => Number(item.appliedValue)).reduce((acc, currentValue) =>  acc + currentValue)).toFixed(2);
		}
	},
	"methods": {
		async clearCart () {
			await this.$store.dispatch("shoppingCart/clearCart");
		},

		async setOrderToPending () {
			if (this.isLoading) {
				return false;
			}
			this.isLoading = true;
			await this.$store.dispatch("shoppingCart/setOrderToPending", this.orderId);
			this.$refs.yapayForm.submit();
		},

		async removeItemFromCart (selectedItemId) {
			await this.$store.dispatch("shoppingCart/removeItemFromCart", selectedItemId);

		}
	},
	async mounted () {
		if (this.orderId) {
			await this.$store.dispatch("shoppingCart/validateOrder", this.orderId);
		}

	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
