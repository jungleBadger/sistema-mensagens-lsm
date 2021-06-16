<template>
	<div
		class="w-full p-2 bg-white shadow-sm flex flex-col gap-2">


		<header class="w-full text-gray-600 border-l-2 pl-2 break-words">


			<h4

				class="text-lg flex flex-wrap ">
				<span class="italic w-full">
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
				-
				<span>
					{{event.categoryName}}
				</span>
				em
				<span>{{event.location}}</span>
				</span>

				<span class="text-lg text-gray-600 font-bold w-full">
					{{event.title}}
				</span>
			</h4>



			<h5
				class="pl-px"
				style="line-height: 22px;">
				{{event.description}}
			</h5>
		</header>


		<div class="flex flex-col gap-2 divide-y">

			<template v-if="isLoading">
				<h4>
					<span class="mr-2">Carregando mensagens...</span>
					<font-awesome-icon
						:icon="['fas', 'spinner-third']"
						spin/>
				</h4>
			</template>
			<template v-else>
				<message-item
					v-for="(message, index) in eventMessages"
					:key="message.id"
					:message="message"
					:message-index="index + 1">
				</message-item>
			</template>


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
	"data": function () {
		return {
			"isLoading": true
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
		this.isLoading = true;
		await this.$store.dispatch("events/retrieveMessagesByEventId", this.event.id);
		this.isLoading = false;
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
