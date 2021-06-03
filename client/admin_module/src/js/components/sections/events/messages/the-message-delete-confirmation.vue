<template>
	<lsm-modal

		@close="goToParentEventHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Remover Mensagem {{ selectedMessage.id }}
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>

			<div class="w-96 flex flex-col gap-1">
				<label class="text-gray-700 ">Confirme a operação digitando <span class="font-semibold">REMOVER</span> abaixo.</label>
				<lsm-input
					v-model="confirmString"
					autofocus
					@keyup.enter="deleteItem"
					placeholder="Digite o valor de confirmação.">
				</lsm-input>
			</div>

		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-4">
				<lsm-button
					v-if="isDocumentExistent"
					:disabled="isFormInvalid"
					:is-loading="isLoading"
					class="w-28 bg-red-400"
					icon-id="trash"
					icon-style="fas"
					label="Remover"
					role="button"
					kind="danger"
					@click="deleteItem">
				</lsm-button>
			</div>

		</template>

	</lsm-modal>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmModal from "../../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";
import LsmInput from "../../../../../../../_etc/shared_components/ui/lsm-input";

export default defineComponent({
	"name": "TheMessageDeleteConfirmation",
	"components": {
		LsmInput,
		LsmButton,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"confirmString": ""
		};
	},
	"computed": {
		isFormInvalid () {
			return !this.confirmString || (this.confirmString.toUpperCase() !== "REMOVER");
		},

		selectedMessage () {
			return this.$store.getters["messages/selectedMessage"];
		},

		isDocumentExistent () {
			return this.selectedMessage && this.selectedMessage.id;
		}
	},
	"methods": {
		goToParentEventHome () {

			return this.$router.push(
				{
					"name": "app.events.details",
					"params": {
						"eventId": this.$route.params.eventId
					}
				}
			);
		},

		async deleteItem() {
			this.isLoading = true;
			await this.$store.dispatch("messages/deleteMessage", this.selectedMessage.id);
			this.isLoading = false;
			return this.goToParentEventHome();
		}
	},

	async created () {
		if (!this.selectedMessage) {
			this.isLoading = true;

			let message = await this.$store.dispatch("messages/retrieveMessageById", this.$route.params.messageId);

			if (message) {
				this.$store.commit(
					"messages/selectedMessage",
					message
				);
			} else {
				return await this.goToParentEventHome();
			}
			this.isLoading = false;
		}
	},

	unmounted () {
		this.$store.commit("messages/unsetSelectedMessage");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
