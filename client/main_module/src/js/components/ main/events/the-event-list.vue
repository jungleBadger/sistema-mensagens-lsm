<template>
	<div
		style="background-color: rgb(215, 232, 239);"
		class="h-full w-full flex flex-col overflow-hidden gap-1">
		<div class="shadow">
			<lsm-input
				v-model="filterText"
				autofocus
				class="border-0"
				placeholder="Digite para procurar eventos e mensagens"
				label="Procurar eventos e mensagens"></lsm-input>
		</div>
		<div class="overflow-auto  flex-1 w-full flex flex-col gap-2 divide-y" v-if="lastUpdate">

			<event-item
				v-for="event in events"
				:key="event.id + lastUpdate"
				:event="event"
			></event-item>
		</div>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import EventItem from "./event-item";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";

export default defineComponent({
	"name": "TheEventList",
	components: { LsmInput, EventItem },
	setup() {
		return {
			...useI18n()
		}
	},
	"data": function () {
		return {
			"filterText": "",
			"debounce": "",
			"lastUpdate": ""
		}
	},
	"computed": {
		"events": function () {
			return this.$store.getters["events/eventItems"];
		},
		"pagination": {
			get() {
				return this.$store.getters["events/pagination"];
			},
			set(val) {
				this.$store.commit("events/pagination", val);
			}
		},
		"isLoading": {
			get() {
				return this.$store.getters["events/isLoading"];
			},
			set(val) {
				this.$store.commit("events/isLoading", val);
			}
		}
	},

	async beforeMount () {
		this.isLoading = true;
		await this.loadEvents();
		this.lastUpdate = Date.now();
		this.isLoading = false;
	},
	"watch": {
		"filterText": function (newValue) {
			this.currentPage = 1;
			this.debounce = Date.now();
			if (!newValue) {
				this.handleAsyncSearch( {
					"filteringField": this.selectedFilteringField,
					"orderBy": this.selectedSortingField,
					"orderDirection": this.selectedSortingDirectionCode,
					"filteringValue": ""
				});
			} else {
				setTimeout(() => {
					if (newValue.length >= 3 && Date.now() - this.debounce >= 300) {
						this.handleAsyncSearch({
							"filteringField": this.selectedFilteringField,
							"orderBy": this.selectedSortingField,
							"orderDirection": this.selectedSortingDirectionCode,
							"filteringValue": newValue
						});
					}
				}, 300);
			}
		}
	},
	"methods": {
		async loadEvents() {
			return await Promise.all([
				this.$store.dispatch("events/retrieveTotalEventsCount"),
				this.$store.dispatch("events/retrieveEvents")
			]);
		},

		async searchEvents() {
			return await this.$store.dispatch(
				"events/searchEvents",
				{
					"filterColumn": this.asyncFilterColumn,
					"filterText": this.asyncFilterText
				}
			);
		},
		async performRelevantQuery() {
			if (this.isLoading) {
				return false;
			}
			this.isLoading = true;
			await (this.asyncFilterText ? this.searchEvents() : this.loadEvents());
			this.lastUpdate = Date.now();
			this.isLoading = false;
		},

		updatePagination(value) {
			this.pagination = value;
			return this.performRelevantQuery();
		},

		handleAsyncSearch(value) {

			this.asyncFilterColumn = value.filteringField;
			this.asyncFilterText = value.filteringValue;
			this.pagination = {
				...this.pagination,
				"skip": 0
			};

			return this.performRelevantQuery();
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
