<template>
	<div
		style="background-color: rgb(215, 232, 239);"
		class="w-full flex flex-1 flex-col gap-2">

		<div
			id="main-search-bar"
			class="flex z-20 left-0 w-full shadow-lg items-center sticky top-0">
			<div class="flex-1">
				<lsm-input
					v-model="filterText"
					autofocus
					type="search"
					autocapitalize="off"
					autocorrect="off"
					spellcheck="false"
					autocomplete="off"
					class="border-none rounded-l-sm h-14"
					placeholder="Digite para procurar eventos e mensagens"
					label="Procurar eventos e mensagens">
				</lsm-input>

			</div>

			<lsm-button
				style="border-radius: 0 !important;"
				class="border-none rounded-none h-14 items-center"
				label="Filtros avançados"
				icon-id="filter-list"
				@click="openAdvancedFiltersModal"
				icon-style="fas"></lsm-button>


		</div>

		<div class=" w-full flex flex-col mb-2 gap-2 md:pl-36 md:pr-36 pl-1 pr-1">

			<event-item
				v-for="event in events"
				:key="event.id"
				:event="event"
			></event-item>
		</div>


		<div
			class="w-full flex items-center justify-center md:pl-36 md:pr-36 pl-1 pr-1"
			v-if="hasNextPage">
			<lsm-button
				style="justify-content: center;"
				class="w-full content-center"
				kind="secondary"
				:is-loading="eventsLoading"
				label="Clique para carregar mais eventos"
				@click="updatePagination">

			</lsm-button>
		</div>



		<transition
			@enter="fadeIn"
			@leave="fadeOut"
			mode="out-in"
			:css="false">
			<the-advanced-filters-modal v-if="isAdvancedFiltersModalOpen"></the-advanced-filters-modal>
		</transition>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import EventItem from "./event-item";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import TheAdvancedFiltersModal from "../the-advanced-filters-modal";
import fade from "../../../../../../_etc/shared_mixins/fade";


export default defineComponent({
	"name": "TheEventList",
	"mixins": [
		fade
	],
	components: { TheAdvancedFiltersModal, LsmButton, LsmInput, EventItem },
	setup() {
		return {
			...useI18n()
		}
	},
	"data": function () {
		return {
			"filterText": "",
			"debounce": "",
			"lastUpdated": Date.now(),
			"eventsLoading": false
		}
	},
	"computed": {
		"isAdvancedFiltersModalOpen": {
			get() {
				return this.$store.getters["utilities/isAdvancedFiltersModalOpen"];
			},
			set(val) {
				return this.$store.commit("utilities/isAdvancedFiltersModalOpen", val);
			}
		},
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

		openAdvancedFiltersModal() {
			this.isAdvancedFiltersModalOpen = true;
		},

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
			this.isLoading = false;
			return true;
		},

		async updatePagination() {
			this.eventsLoading = true;
			this.pagination = {
				...this.pagination,
				"skip": this.pagination.skip + 1
			};
			await this.performRelevantQuery(true);
			this.eventsLoading = false;
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
