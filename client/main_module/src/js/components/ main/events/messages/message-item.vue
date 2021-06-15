<template>
	<div
		class="flex gap-2 pl-1 w-full items-center pt-1.5 flex-wrap"
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
				<span class="overflow-hidden break-all">{{ message.title }}</span>
			</h5>
			<h6>
				Por {{ message.brotherName }} em
				<i18n-d
					key="short"
					:value="message.messageDate"
					locale="pt"
					tag="span"
				></i18n-d>
			</h6>
			<div>

				<a
					v-if="message.pdfFilePath"
					:href="`/api/message/test/x?filePath=${message.pdfFilePath}`">
					<font-awesome-icon :icon="['fas', 'file-pdf']" />
					Clique para baixar esboço em PDF
				</a>
			</div>
		</header>


		<div v-if="isLoggedIn">
			<lsm-button
				v-if="isAlreadyInCart"
				kind="danger"
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
		async addItemToCart () {
			await this.$store.dispatch("shoppingCart/addItemToCart", this.message.id);
		},
		async removeItemFromCart () {
			await this.$store.dispatch("shoppingCart/removeItemFromCart", this.isAlreadyInCart.orderItemId);
		}
	},
	async mounted () {
		console.log("retrieve status");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
