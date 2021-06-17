<template>
	<div
		class="w-full p-2 bg-white shadow flex flex-col gap-2 rounded overflow-hidden">


		<header class="w-full break-words">

			<h1 class="text-2xl text-indigo-800">
				{{ event.title }}
			</h1>

			<h2 class="text-gray-500 font-semibold pl-px">

				<span class="space-x-4"><span class="capitalize">{{event.categoryName }}</span> em {{ event.location }}</span> de <span>
					<i18n-d
						key="short"
						:value="event.startDate"
						locale="pt"
						tag="span"
					></i18n-d> à
					<i18n-d
						key="short"
						:value="event.endDate"
						locale="pt"
						tag="span"
					></i18n-d>
				</span>
			</h2>

			<h3 class="text-gray-500 pl-px">
				{{ event.description }}
			</h3>



		</header>


		<main class="">


			<div class="flex flex-col">
				<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
						<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Ordem
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Título
									</th>

									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Data
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Irmão
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Preço
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Esboço
									</th>
									<th class="relative px-6 py-3" scope="col">
										<span class="sr-only">Ação</span>
									</th>
								</tr>
								</thead>
								<tbody class="bg-white divide-y divide-gray-200">

									<message-item
										v-for="(message, index) in event.messages"
										:key="message.id"
										:message="message"
										:message-index="index + 1">
									</message-item>

								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>


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
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
