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

		<div v-if="hasNextPage">
			{{pagination}}
			{{eventsCount}}
			<lsm-button @click="updatePagination"></lsm-button>
		</div>


		<span>oi</span>


	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import EventItem from "./event-item";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";

export default defineComponent({
	"name": "TheEventList",
	components: { LsmButton, LsmInput, EventItem },
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
		"eventsCount": function () {
			return this.$store.getters["events/totalEventsCount"];
		},
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
		"hasNextPage": function () {
			return this.eventsCount > (this.pagination.skip + this.pagination.limit);
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
		if (!this.events || !this.events.length) {
			this.isLoading = true;
			await this.loadEvents();
			this.lastUpdate = Date.now();
			this.isLoading = false;
		}

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
		async loadEvents(isPagination) {
			return await Promise.all([
				this.$store.dispatch("events/retrieveTotalEventsCount"),
				this.$store.dispatch("events/retrieveEvents", {
					isPagination
				})
			]);
		},

		async searchEvents(isPagination) {
			return await this.$store.dispatch(
				"events/searchEvents",
				{
					"filterColumn": this.asyncFilterColumn,
					"filterText": this.asyncFilterText,
					isPagination
				}
			);
		},
		async performRelevantQuery(isPagination) {
			if (this.isLoading) {
				return false;
			}
			this.isLoading = true;
			await (this.asyncFilterText ? this.searchEvents(isPagination) : this.loadEvents(isPagination));
			this.lastUpdate = Date.now();
			this.isLoading = false;
		},

		updatePagination() {
			this.pagination = {
				...this.pagination,
				"skip": this.pagination.skip + 1
			};
			return this.performRelevantQuery(true);
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
