<template>

	<div>

		<div class="w-full flex flex-col gap-1.5">
			<div class="flex gap-1 items-center flex-wrap">
				<label class="flex-1 text-2xl text-gray-700 ">Mensagens</label>
				<div class="flex gap-2 flex-wrap">

					<lsm-button
						:href="{
						'name': 'app.events.organize',
						'params': {'categoryId': eventId}
					}"
						class="w-44"
						icon-id="arrow-down-1-9"
						icon-style="fal"
						kind="tertiary"
						label="Organizar mensagens"></lsm-button>

					<lsm-button
						:href="{
						'name': 'app.events.message.details',
						'params': {'categoryId': eventId, 'messageId': 'novo'}
					}"
						class="w-40"
						icon-id="plus"
						icon-style="fas"
						kind="secondary"
						label="Criar Mensagem"></lsm-button>
				</div>

			</div>


			<lsm-table
				:columns-data="tableColumns"
				:handle-click="true"
				:is-async-loading="isLoading"
				:items-per-page="pagination.limit"
				:table-items="messages"
				:total-items-count="totalMessagesCountByEventId"
				class="shadow-sm"
				enable-delete-button
				order-by="ORDEM"
				order-direction="ASC"
				@deleteRequest="openDeleteModal"
				@paginate="updatePagination"
				@select="selectItem">
			</lsm-table>

		</div>


	</div>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";
import LsmTable from "../../../../../../../_etc/shared_components/ui/lsm-table";

export default defineComponent({
	"name": "TheMessageList",
	"components": {
		LsmTable,
		LsmButton
	},
	"props": {
		"eventId": {
			"type": [Number, String],
			"required": true
		}
	},
	"data": function () {
		return {
			"isLoading": true
		};
	},
	"computed": {
		tableColumns () {
			return this.$store.getters["messages/tableColumns"];
		},
		"pagination": {
			get () {
				return this.$store.getters["messages/pagination"];
			},
			set (val) {
				this.$store.commit("messages/pagination", val);
			}
		},

		"totalMessagesCountByEventId": function () {
			return this.$store.getters["messages/totalMessagesCountByEventId"] || 0;
		},

		messages () {
			return this.$store.getters["messages/messageItemsByEventId"];
		}
	},
	"methods": {

		openDeleteModal (item) {
			this.$store.commit("messages/selectedMessage", item);
			this.$router.push(
				{
					"name": "app.events.message.delete",
					"params": {
						"messageId": item.id
					}
				}
			);
		},

		async loadMessages () {
			this.isLoading = true;
			await Promise.all([
				this.$store.dispatch("messages/retrieveMessagesByEventId", this.eventId),
				this.$store.dispatch("messages/retrieveTotalMessagesCountByEventId", this.eventId)
			]);
			this.isLoading = false;
		},
		updatePagination (value) {
			this.pagination = value;
			return this.loadMessages();
		},

		selectItem (item) {
			this.$store.commit("messages/selectedMessage", item);
			this.$router.push(
				{
					"name": "app.events.message.details",
					"params": {
						"categoryId": this.eventId,
						"messageId": item.id
					}
				}
			);
		}

	},
	async mounted () {
		await this.loadMessages();
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
