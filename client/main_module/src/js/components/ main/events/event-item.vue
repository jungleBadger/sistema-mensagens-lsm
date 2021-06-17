<template>
	<div
		class="w-full p-2 bg-white shadow-sm flex flex-col gap-2">


		<header class="w-full text-gray-600 break-words">

			<h1>
				{{event.title}}
			</h1>

			<h2>
				{{event.description}}
			</h2>

			<h3 class="flex flex-col">
				<span>
					<i18n-d
						:value="event.startDate"
						key="short"
						locale="pt"
						tag="span"
					></i18n-d>
				~
				<i18n-d
					:value="event.endDate"
					key="short"
					locale="pt"
					tag="span"
				></i18n-d>
				</span>
				<span>{{event.location}}</span>
			</h3>


		</header>


		<main class="flex flex-col gap-2 divide-y">

			<message-item
				v-for="(message, index) in event.messages"
				:key="message.id"
				:message="message"
				:message-index="index + 1">
			</message-item>


		</main>
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
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
