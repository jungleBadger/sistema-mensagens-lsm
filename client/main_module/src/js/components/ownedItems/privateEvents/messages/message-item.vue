<template>

	<tr style="vertical-align: baseline;">
		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">
			<div class="text-sm font-medium text-gray-900">
				{{ message.order }}
			</div>
		</td>
		<td
			class="px-2 py-2 md:px-4 md:py-3 md:whitespace-normal">
			<div
				style="max-width: 180px;"
				class="text-sm font-medium text-gray-900 overflow-ellipsis overflow-hidden">
				{{ message.title }}
			</div>
		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap hidden md:table-cell">

			<div class="text-sm text-gray-500">
				<i18n-d
					key="short"
					:value="message.messageDate"
					locale="pt"
				></i18n-d>
			</div>
		</td>
		<td class="px-2 py-2 md:px-4 md:py-3 hidden md:table-cell">
			<div class="text-sm text-gray-500">{{ message.brotherName }}</div>

		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">
			<span
				style="min-width: 60px;"
			>
				<template v-if="!isDeleted && message.pdfFilePath">
				<a
					:href="`${hostURL}/api/message/file/download?filePath=${message.pdfFilePath}&fileName=${messageIndex}_${message.title}_esboco.pdf`"
					class="text-indigo-600 hover:text-indigo-900">Download
				</a>
			</template>
			<template v-else>-</template>

			</span>

		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">
			<template v-if="!isRemoved">
				<a
					:href="`${hostURL}/api/message/self/download/${message.id}`"
					class="text-indigo-600 hover:text-indigo-900"
					style="min-width: 140px;">Download
				</a>
				/
				<a
					href="#"
					@click="setAudioPath"
					class="text-indigo-600 hover:text-indigo-900"
					style="min-width: 140px;">Ouvir
				</a>
			</template>
			<template v-else>-</template>


		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">

			<template v-if="isRemoved">
				<lsm-button
					:is-loading="shoppingItemLoading"
					class="h-8"
					icon-id="plus"
					icon-style="fas"
					kind="primary-outline"
					label="Adicionar"
					@click="addItemToCart">
				</lsm-button>
			</template>
			<template v-else>
				<lsm-button
					:is-loading="shoppingItemLoading"
					class="h-8"
					icon-id="trash-xmark"
					icon-style="fas"
					kind="danger-outline"
					label="Remover"

					@click="removeItemFromCart"
				></lsm-button>
			</template>


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
			"hostURL": `https://${window.location.host}`,
			"isRemoved": false
		};
	},
	"computed": {
		"ownedItems": function () {
			return this.$store.getters["orders/ownedItems"];
		}
	},
	"methods": {
		setAudioPath() {
			this.$store.commit("privateEvents/selectedAudioPath", `${this.hostURL}/api/message/self/download/${this.message.id}`)
		},
		async addItemToCart () {
			if (this.shoppingItemLoading) {
				return false;
			}
			this.shoppingItemLoading = true;
			await this.$store.dispatch("shoppingCart/addItemToCart", this.message.id);
			this.isRemoved = false;
			this.shoppingItemLoading = false;
		},
		async removeItemFromCart () {
			if (this.shoppingItemLoading) {
				return false;
			}
			console.log(this.ownedItems)
			this.shoppingItemLoading = true;
			let targetEvent = this.ownedItems.find(ownedItem => ownedItem.messageId === this.message.id);
			if (targetEvent && targetEvent.orderItemId) {
				await this.$store.dispatch("shoppingCart/removeItemFromCart", targetEvent.orderItemId);
			}
			this.isRemoved = true;
			this.shoppingItemLoading = false;



		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
