<template>
	<div
		class="event-item p-2 bg-white shadow flex flex-col gap-2 rounded-sm overflow-hidden">


		<header class="w-full break-words">

			<h1 class="text-2xl text-indigo-800">
				{{ event.title }}
			</h1>

			<h2 class="text-gray-500 font-semibold pl-px">

				<span class="space-x-4"><span class="capitalize">{{ event.categoryName }}</span> em {{ event.location }}</span>
				de <span>
						<span>{{ startDateString }}</span> à
				<span>{{ endDateString }}</span>
				</span>
			</h2>

			<h3 class="text-gray-500 pl-px">
				{{ event.description }}
			</h3>


		</header>


		<main class="">


			<div class="flex flex-col">
				<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div class="py-2 align-middle inline-block min-w-full sm:px-4 lg:px-8">
						<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
								<tr>
									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Ordem
									</th>
									<th
										class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Título
									</th>

									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Data
									</th>
									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Irmão
									</th>
									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
										scope="col">
										Preço
									</th>
									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Esboço
									</th>
									<th class="px-2 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										scope="col">
										Audio
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
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

export default defineComponent({
	"name": "PrivateEventItem",
	components: { MessageItem },
	"props": {
		"event": {
			"type": Object,
			"required": true
		}
	},
	"computed": {
		"startDateString": function () {
			if (this.event && this.event.startDate) {
				return dayjs(this.event.startDate).format('DD/MM/YYYY');
			}
		},

		"endDateString": function () {
			if (this.event && this.event.endDate) {
				return dayjs(this.event.endDate).format('DD/MM/YYYY');
			}
		},


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
.event-item {
	max-width: 100%;
	width: 84%;
}

@media screen and (max-width: 1024px) {
	.event-item {
		width: 92%;
	}
}

@media screen and (max-width: 768px) {
	.event-item {
		width: 100%;
	}
}

</style>
