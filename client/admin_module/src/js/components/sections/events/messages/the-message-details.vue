<template>
	<lsm-modal
		class="h-auto"
		@close="goToParentEventDetails">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis" style="max-width: calc(100% - 48px);">
				<template v-if="isDocumentExistent">
					Editar Mensagem {{ selectedMessage.title }}
				</template>
				<template v-else>
					Criar nova Mensagem
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>

			<div class="flex flex-col w-full gap-2">
				<lsm-progress-bar v-if="isLoading"></lsm-progress-bar>

				<div class="flex gap-2 flex-wrap">

					<div class="w-80 flex flex-col gap-1">
						<label class="text-gray-700 ">Ordem</label>
						<lsm-input
							:model-value="currentOrder"
							aria-disabled="true"
							aria-readonly="true"
							disabled
							readonly>
						</lsm-input>
					</div>

					<div class="w-44 flex flex-col gap-1">
						<label class="text-gray-700">Valor</label>
						<div class="w-full flex">
							<div class="block w-10 h-full bg-gray-300 p-1 flex items-center justify-center">R$</div>
							<div class="flex-1">
								<lsm-input
									v-model="messageValue"
									aria-disabled="true"
									aria-readonly="true"
									data-number-to-fixed="2"
									disabled
									min="1.00"
									placeholder="1.00"
									readonly
									step="0.01"
									type="number"></lsm-input>
							</div>
						</div>
					</div>

				</div>

				<div class="flex md:w-80 flex-col gap-1">
					<label class="text-gray-700">Status</label>
					<lsm-checkbox
						v-model="isEnabled"
						:label="isEnabled ? 'Habilitada para venda' : 'Desabilitada para venda'"
					></lsm-checkbox>
				</div>


				<div class="w-full md:w-80 flex flex-col gap-1">
					<label class="text-gray-700 ">Título</label>

					<lsm-text-area
						v-model="title"
						autofocus
						max-length="512"
						placeholder="Digite o título">
					</lsm-text-area>
				</div>


				<div class="w-full md:w-80 flex flex-col gap-1">
					<label class="text-gray-700 ">Data da mensagem</label>
					<litepie-datepicker
						v-model="messageDate"
						:disable-date="validDateRange"
						:start-from="startFrom"
						as-single
						i18n="pt-br">
						<lsm-input
							:model-value="parsedDate"
							placeholder="Selecione data da mensagem"></lsm-input>
					</litepie-datepicker>
				</div>


				<div class="flex flex-col gap-1 flex-wrap">
					<label class="text-gray-700 ">Irmão que ministrou</label>
					<div class="flex gap-2 flex-wrap">

						<div class="w-80">
							<lsm-select
								v-model="brotherId"
								:options="brothers">
							</lsm-select>
						</div>

						<router-link
							:to="{'name': 'app.brothers'}"
							class="h-10 group relative py-2 px-2 border flex justify-between items-center
							text-blue-600 border w-44 hover:bg-gray-300 active:bg-gray-400 transition-colors
	text-sm font-medium rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 transition-colors">
							<span>
								Gerenciar irmãos
							</span>
							<font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
						</router-link>
					</div>

				</div>

				<div class="w-full w-full flex flex-col gap-1">
					<label class="text-gray-700 ">Audio</label>


					<div class="flex w-full gap-2">
						<template v-if="audioFilePath">

							<audio
								class="h-10 w-80 border border-gray-300"
								controls>
								<source
									:src="`/api/message/test/x?filePath=${audioFilePath}`"
									type="audio/mpeg">
							</audio>

							<lsm-button
								class="h-10 w-44"
								kind="secondary"
								label="Substituir arquivo"
								@click="toggleAudioFile"
							></lsm-button>

						</template>


						<template v-else>

							<div class="w-80">
								<lsm-input
									accept="audio/*"
									class="cursor-pointer"
									label="Faça upload de um arquivo de audio"
									type="file"
									@change="handleAudioFile"></lsm-input>
							</div>

							<lsm-button
								v-if="isDocumentExistent && audioFilePathReference"
								class="h-10 w-44"
								kind="secondary"
								label="Cancelar"
								@click="toggleAudioFile"
							></lsm-button>
						</template>
					</div>

				</div>


				<div class="w-full w-full flex flex-col gap-1 mb-2">
					<label class="text-gray-700 ">Esboço PDF (opcional)</label>


					<div class="flex w-full gap-2">
						<template v-if="pdfFilePath">

							<a
								:href="`/api/message/test/x?filePath=${pdfFilePath}`"
								class="flex-1" target="_self">Download</a>

							<lsm-button
								class="h-10 w-44"
								kind="secondary"
								label="Substituir arquivo"
								@click="togglePDFFile"
							></lsm-button>


						</template>


						<template v-else>

							<div class="w-80">
								<lsm-input
									accept=".pdf"
									class="cursor-pointer flex-1"
									label="Faça upload de um esboço PDF"
									type="file"
									@change="handlePDFFile"></lsm-input>
							</div>

							<lsm-button
								v-if="isDocumentExistent && pdfFilePathReference"
								class="h-10 w-44"
								kind="secondary"
								label="Cancelar"
								@click="togglePDFFile"
							></lsm-button>
						</template>
					</div>

				</div>

			</div>


		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-2">

				<lsm-button
					kind="tertiary"
					label="Cancelar"
					@click="goToParentEventDetails">
				</lsm-button>

				<lsm-button
					:disabled="isFormInvalid"
					:is-loading="isLoading"
					class="w-24"
					icon-id="check"
					icon-style="fas"
					label="Salvar"
					role="button"
					@click="submitForm">
				</lsm-button>
			</div>

		</template>

	</lsm-modal>


</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LitepieDatepicker from "litepie-datepicker";
import LsmModal from "../../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmInput from "../../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";
import LsmTextArea from "../../../../../../../_etc/shared_components/ui/lsm-text-area";
import LsmSelect from "../../../../../../../_etc/shared_components/ui/lsm-select";
import LsmCheckbox from "../../../../../../../_etc/shared_components/ui/lsm-checkbox";
import dayjs from "dayjs";
import LsmProgressBar from "../../../../../../../_etc/shared_components/ui/lsm-progress-bar";

export default defineComponent({
	"name": "TheMessageDetails",
	"components": {
		LsmProgressBar,
		LsmCheckbox,
		LsmSelect,
		LitepieDatepicker,
		LsmTextArea,
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {

			"title": "",
			"messageDate": "",
			"messageValue": "1.00",

			"audioFile": "",
			"pdfFile": "",

			"audioFilePath": "",
			"audioFilePathReference": "",
			"pdfFilePath": "",
			"pdfFilePathReference": "",
			"isEnabled": true,

			"brotherId": "",

			"isLoading": false
		};
	},
	"computed": {
		"parsedDate": function () {
			return this.messageDate ? dayjs(new Date(this.messageDate)).format("DD/MM/YYYY") : "";

		},

		"startFrom": function () {
			if (this.isDocumentExistent) {
				return new Date(this.selectedMessage.messageDate);
			} else if (this.selectedEvent) {
				return new Date(this.selectedEvent.startDate);
			}
		},

		"isDocumentExistent": function () {
			return this.selectedMessage && this.selectedMessage.id;
		},

		"isFormInvalid": function () {
			return !this.title || !this.currentOrder || !this.brotherId || !this.messageDate || (!this.audioFile && !this.audioFilePath);
		},

		"selectedEvent": function () {
			return this.$store.getters["events/selectedEvent"];
		},

		"selectedMessage": function () {
			return this.$store.getters["messages/selectedMessage"];
		},

		"totalMessagesCountByEventId": function () {
			return this.$store.getters["messages/totalMessagesCountByEventId"] || 0;
		},

		"currentOrder": function () {
			return this.isDocumentExistent ? this.selectedMessage.order : this.totalMessagesCountByEventId + 1;
		},

		"brothers": function () {
			return (this.$store.getters["brothers/brotherItems"] || []).map(item => {
				return {
					"id": item.id,
					"label": item.displayName
				};
			});
		}

	},
	"methods": {
		goToParentEventDetails () {
			return this.$router.push({
				"name": "app.events.details",
				"params": { "eventId": this.$route.params.eventId }
			});
		},

		toggleAudioFile () {
			this.audioFilePath = this.audioFilePath ? "" : this.audioFilePathReference;
		},

		togglePDFFile () {
			this.pdfFilePath = this.pdfFilePath ? "" : this.pdfFilePathReference;
		},

		handleAudioFile (ev) {

			if (ev.srcElement.files && ev.srcElement.files.length) {
				this.audioFile = ev.srcElement.files[0];
			}
		},

		handlePDFFile (ev) {

			if (ev.srcElement.files && ev.srcElement.files.length) {
				this.pdfFile = ev.srcElement.files[0];
			}
		},

		async submitForm () {
			this.isLoading = true;
			if (this.isDocumentExistent) {
				await this.$store.dispatch("messages/updateMessage", {
					"id": this.selectedMessage.id,
					"eventId": this.$route.params.eventId,
					"title": this.title,
					"audioFile": this.audioFile,
					"audioFilePath": this.audioFilePath,
					"pdfFile": this.pdfFile,
					"pdfFilePath": this.pdfFilePath,
					"brotherId": this.brotherId,
					"brotherName": (this.brothers.find(brother => Number(brother.id) === Number(this.brotherId)) || {}).label,
					"order": this.currentOrder,
					"messageDate": dayjs(this.messageDate).startOf("day"),
					"messageValue": this.messageValue,
					"isEnabled": this.isEnabled
				});

			} else {
				await this.$store.dispatch("messages/createMessage", {
					"eventId": this.$route.params.eventId,
					"title": this.title,
					"pdfFile": this.pdfFile,
					"audioFile": this.audioFile,
					"brotherId": this.brotherId,
					"order": this.currentOrder,
					"messageDate": dayjs(this.messageDate).startOf("day"),
					"messageValue": this.messageValue,
					"isEnabled": this.isEnabled
				});

				await Promise.all([
					this.$store.dispatch("messages/retrieveTotalMessagesCountByEventId", this.$route.params.eventId),
					this.$store.dispatch("messages/retrieveMessagesByEventId", this.$route.params.eventId)
				]);
			}

			this.goToParentEventDetails();
			this.isLoading = false;

		},

		validDateRange (date) {
			let time = date.getTime();
			return this.selectedEvent ? time < new Date(this.selectedEvent.startDate).getTime() || time > new Date(this.selectedEvent.endDate).getTime() : false;
		}
	},
	async created () {

		if (!this.selectedMessage && this.$route.params.messageId !== "novo") {
			this.isLoading = true;

			let message = await this.$store.dispatch("messages/retrieveMessageById", this.$route.params.messageId);
			if (message) {
				this.$store.commit(
					"messages/selectedMessage",
					message
				);

			} else {

				return await this.$router.replace({
					"name": "app.events.details",
					"params": {
						"eventId": this.$route.params.eventId
					}
				});
			}

			this.isLoading = false;

		}

		await Promise.all([
			this.$store.dispatch("brothers/retrieveBrothers", {
				"skip": 0,
				"limit": 100
			}),
			this.$store.dispatch("messages/retrieveTotalMessagesCountByEventId", this.$route.params.eventId)
		]);

		if (this.selectedMessage) {
			this.title = this.selectedMessage.title;
			this.messageDate = this.selectedMessage.messageDate.toString();
			this.messageValue = this.selectedMessage.messageValue;
			this.audioFilePath = this.selectedMessage.audioFilePath;
			this.audioFilePathReference = this.selectedMessage.audioFilePath;
			this.pdfFilePath = this.selectedMessage.pdfFilePath;
			this.pdfFilePathReference = this.selectedMessage.pdfFilePath;
			this.isEnabled = this.selectedMessage.isEnabled;
			this.brotherId = this.selectedMessage.brotherId;
			this.createdAt = this.selectedMessage.createdAt;
		}
	},
	unmounted () {
		this.$store.commit("messages/unsetSelectedMessage");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
