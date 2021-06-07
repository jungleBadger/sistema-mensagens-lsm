<template>
	<div
		class="w-full p-2 bg-white shadow-sm">
		<h6 class="text-xl">
			{{event.title}}
			{{event.totalMessages}}
		</h6>
		<div class="flex flex-col gap-1">
			<message-item
				v-for="(message, index) in event.messages"
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

export default defineComponent({
	"name": "EventItem",
	components: { MessageItem },
	"props": {
		"event": {
			"type": Object,
			"required": true
		}
	},
	"computed": {
	},
	async mounted () {
		console.log("retrieve messages");
		console.log(this.event.id);
		let a = await this.$store.dispatch("events/retrieveMessagesByEventId", this.event.id);
		console.log(a);
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
