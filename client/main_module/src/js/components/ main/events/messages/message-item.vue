<template>

	<tr style="vertical-align: baseline;">
		<td class="px-2 py-2 md:px-4 md:py-4 whitespace-nowrap">
			<div class="text-sm font-medium text-gray-900">
				{{ message.order }}
			</div>
		</td>
		<td
			class="px-2 py-2 md:px-4 md:py-4 md:whitespace-normal">
			<div
				style="max-width: 180px;"
				class="text-sm font-medium text-gray-900 overflow-ellipsis overflow-hidden">
				{{ message.title }}
			</div>
		</td>

		<td class="px-2 py-2 md:px-4 md:py-4 whitespace-nowrap hidden md:table-cell">

			<div class="text-sm text-gray-500">
				<i18n-d
					key="short"
					:value="message.messageDate"
					locale="pt"
				></i18n-d>
			</div>
		</td>
		<td class="px-2 md:px-4 md:py-4 hidden md:table-cell">
			<div class="text-sm text-gray-500">{{ message.brotherName }}</div>

		</td>
		<td
			class="px-2 md:px-4 md:py-4 text-sm text-gray-500 hidden md:table-cell">
			R$ {{ message.messageValue }}
		</td>

		<td v-if="isLoggedIn" class="px-2 md:px-4 md:py-4 whitespace-nowrap text-sm font-medium">

			<span
				style="min-width: 60px;"
			>
				<template v-if="message.pdfFilePath">
				<a
					:href="`${hostURL}/api/message/file/download?filePath=${message.pdfFilePath}&fileName=${messageIndex}_${message.title}_esboco.pdf`"
					class="text-indigo-600 hover:text-indigo-900">Download
				</a>
			</template>
			<template v-else>-</template>
			</span>

		</td>

		<td v-if="isLoggedIn" class="px-2 md:px-4 md:py-4 whitespace-nowrap text-sm font-medium">
			<a
				v-if="isAlreadyOwned"
				:href="`${hostURL}/api/message/self/download/${message.id}`"
				class="text-indigo-600 hover:text-indigo-900"
				style="min-width: 110px;">Download
			</a>

			<lsm-button
				v-else-if="isAlreadyInCart"
				:is-loading="shoppingItemLoading"
				class="h-8"
				icon-id="cart-xmark"
				icon-style="fas"
				kind="danger-outline"
				label="Remover"
				style="min-width: 110px;"

				@click="removeItemFromCart"
			></lsm-button>

			<lsm-button
				v-else
				:is-loading="shoppingItemLoading"
				class="h-8"
				icon-id="cart-plus"
				icon-style="fas"
				kind="primary-outline"
				label="Adicionar"
				style="min-width: 110px;"

				@click="addItemToCart">

			</lsm-button>
		</td>
	</tr>

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
			"shoppingItemLoading": false,
			"hostURL": `https://${window.location.host}`
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
			if (this.shoppingItemLoading) {
				return false;
			}
			this.shoppingItemLoading = true;
			await this.$store.dispatch("shoppingCart/addItemToCart", this.message.id);
			this.shoppingItemLoading = false;
		},
		async removeItemFromCart () {
			if (this.shoppingItemLoading) {
				return false;
			}
			this.shoppingItemLoading = true;
			await this.$store.dispatch("shoppingCart/removeItemFromCart", this.isAlreadyInCart.orderItemId);
			this.shoppingItemLoading = false;



		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
