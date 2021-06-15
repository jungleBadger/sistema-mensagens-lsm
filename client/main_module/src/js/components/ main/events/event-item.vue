<template>
	<div
		class="w-full p-2 bg-white shadow-sm flex flex-col gap-4">
		<header class="text-gray-800" >
			<h4 class="font-bold text-lg">
				{{event.title}}
			</h4>


			<h5 class="italic">
				<span>
					{{event.categoryName}}
				</span>
				em
				<span>{{event.location}}</span>
				de
				<i18n-d
					:value="event.startDate"
					key="short"
					locale="pt"
					tag="span"
				></i18n-d>
				à
				<i18n-d
					:value="event.endDate"
					key="short"
					locale="pt"
					tag="span"
				></i18n-d>

			</h5>

		</header>
		<div class="flex flex-col gap-1.5 divide-y">
			<message-item
				v-for="(message, index) in eventMessages"
				:key="message.id"
				:message="message"
				:message-index="index + 1">
			</message-item>
		</div>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import MessageItem from "./messages/message-item";
import { useI18n } from "vue-i18n";


export default defineComponent({
	"name": "EventItem",
	components: { MessageItem },
	"props": {
		"event": {
			"type": Object,
			"required": true
		}
	},
	setup () {
		const {
			datetimeFormats
		} = useI18n();

		return {
			datetimeFormats
		};
	},
	"computed": {
		"eventMessages": function () {
			return this.$store.getters["events/messagesByEvent"][this.event.id] || [];
		}
	},
	async mounted () {
		await this.$store.dispatch("events/retrieveMessagesByEventId", this.event.id);
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
