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
		<td
			class="px-2 py-2 md:px-4 md:py-3 text-sm text-gray-500 hidden md:table-cell">
			R$ {{ message.messageValue }}
		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">
			<span
				style="min-width: 60px;"
			>
				<template v-if="message.pdfFilePath">
				<a
					:href="`${hostURL}/api/message/file/download?filePath=${message.pdfFilePath}&fileName=${messageIndex}_${message.title}_esboco.pdf`"
					class="text-indigo-600 hover:text-indigo-900">Download
				</a>
			</template>
			<template v-else>-</template>

			</span>

		</td>

		<td class="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">

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
			"hostURL": `https://${window.location.host}`
		};
	},
	"methods": {
		setAudioPath() {
			this.$store.commit("privateEvents/selectedAudioPath", `${this.hostURL}/api/message/self/download/${this.message.id}`)
		}
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
