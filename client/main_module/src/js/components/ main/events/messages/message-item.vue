<template>
	<div
		class="flex gap-2 pl-1 items-center pt-2 flex-wrap w-full "
		style="flex-basis: 40px;">

		<header
			class="flex flex-col flex-1 font-sans-alternative gap-1 text-sm"
			style="min-width: 240px;">
			<h5 class="flex flex-1 gap-1">
				<i18n-n
					:value="messageIndex"
					format="integer"
					locale="pt"
					tag="span"
				></i18n-n>
				-
				<div class="flex flex-wrap gap-1">
					<span class="w-full overflow-hidden break-all">{{ message.title }}</span>
					<span class="w-full">
						Por {{ message.brotherName }} em
						<i18n-d
							key="short"
							:value="message.messageDate"
							locale="pt"
							tag="span"
						></i18n-d>
					</span>


					<div
						v-if="isLoggedIn"
						class="flex flex-wrap gap-2">


						<template v-if="isAlreadyOwned">
							<lsm-button
								:href="`/api/message/self/download/${message.id}`"
								class="h-8"
								icon-id="download"
								icon-style="fas"
								kind="tertiary"
								label="Clique para baixar a mensagem em audio"
								style="min-width: 260px;"
							></lsm-button>
						</template>
						<template v-else>
							<lsm-button
								v-if="isAlreadyInCart"
								:is-loading="shoppingItemLoading"
								class="h-8"
								icon-id="cart-xmark"
								icon-style="fas"
								kind="danger-outline"
								label="Clique para remover do carrinho"
								style="min-width: 260px;"
								@click="removeItemFromCart"
							></lsm-button>

							<lsm-button
								v-else
								:is-loading="shoppingItemLoading"
								class="h-8"
								icon-id="cart-plus"
								icon-style="fas"
								kind="primary-outline"
								label="Clique para adicionar ao carrinho"
								style="min-width: 260px;"
								@click="addItemToCart"></lsm-button>
						</template>


						<lsm-button
							v-if="message.pdfFilePath"
							:href="`/api/message/test/x?filePath=${message.pdfFilePath}&fileName=${messageIndex}_${message.title}_esboco.pdf`"
							class="h-8"
							icon-id="file-pdf"
							icon-style="fas"
							kind="tertiary"
							label="Clique para baixar esboço em PDF"
							style="min-width: 260px;"/>
					</div>
				</div>
			</h5>

		</header>


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
	"data": function () {
		return {
			"shoppingItemLoading": false
		};
	},
	"computed": {
		"currentCart": function () {
			return this.$store.getters["shoppingCart/currentCart"];
		},
		"ownedItems": function () {
			return this.$store.getters["orders/ownedItems"];
		},
		"isLoggedIn": function () {
			return this.$store.getters["utilities/userInfo"].id;
		},
		"isAlreadyOwned": function () {
			return this.ownedItems.find(orderItem => orderItem.messageId === this.message.id);
		},
		"isAlreadyInCart": function () {
			return !this.isAlreadyOwned && this.currentCart.find(orderItem => orderItem.messageId === this.message.id);
		}
	},
	"methods": {
		async addItemToCart () {
			this.shoppingItemLoading = true;
			await this.$store.dispatch("shoppingCart/addItemToCart", this.message.id);
			this.shoppingItemLoading = false;
		},
		async removeItemFromCart () {
			this.shoppingItemLoading = true;
			await this.$store.dispatch("shoppingCart/removeItemFromCart", this.isAlreadyInCart.orderItemId);
			this.shoppingItemLoading = false;

		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
