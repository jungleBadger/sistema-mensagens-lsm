<template>
	<div
		style="background-color: #f9fafb;"
		class="w-full flex flex-1 flex-col gap-2">

		<div
			id="main-search-bar"
			class="flex z-30 left-0 w-full shadow-lg items-center sticky top-0 flex-wrap">
			<div class="flex-1">
				<lsm-input
					ref="searchInput"
					v-model="filterText"
					:disabled="useAdvancedSearch || isLoading"
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
				v-if="useAdvancedSearch"
				style="border-radius: 0 !important;"
				class="border-none rounded-none h-14 items-center"
				label="Remover filtros avançados"
				kind="secondary"
				icon-id="filter-circle-xmark"
				icon-style="fas"
				@click="removeFilters"></lsm-button>

			<lsm-button
				:is-loading="isLoading"
				style="border-radius: 0 !important;"
				class="border-none rounded-none h-14 items-center"
				label="Filtros avançados"
				icon-id="filter-list"
				@click="openAdvancedFiltersModal"
				icon-style="fas"></lsm-button>


		</div>

		<div class="flex flex-col mb-2 gap-4 pl-1 pr-1 items-center">



			<template v-if="!events || !events.length" >
				<h4 class="text-lg w-full text-center">Nenhum evento ou mensagem encontrados.</h4>
			</template>
			<template v-else>
				<private-event-item
					v-for="event in events"
					:key="event.id"
					:event="event"
				></private-event-item>

			</template>
		</div>


		<div
			class="w-full h-12 flex gap-2 items-center justify-center"
			v-if="isLoading">
			<font-awesome-icon
				:icon="['fas', 'spinner-third']"
				spin/> Carregando...
		</div>
		<div
			class=" flex items-center justify-center w-full pl-1 pr-1 h-12"
			v-else-if="hasNextPage">
			<lsm-button
				style="justify-content: center;"
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
			<the-advanced-filters-modal
				v-if="isAdvancedFiltersModalOpen"></the-advanced-filters-modal>
		</transition>
	</div>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import {useI18n} from "vue-i18n";
import PrivateEventItem from "./private-event-item";
import LsmInput from "../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button";
import TheAdvancedFiltersModal from "../the-advanced-filters-modal";
import fade from "../../../../../../_etc/shared_mixins/fade";


export default defineComponent({
	"name": "ThePrivateEventList",
	"mixins": [
		fade
	],
	components: { TheAdvancedFiltersModal, LsmButton, LsmInput, PrivateEventItem },
	setup() {
		return {
			...useI18n()
		}
	},
	"data": function () {
		return {
			"filterText": "",
			"debounce": "",
			"scrollDebounce": "",
			"eventsLoading": false
		}
	},
	"computed": {
		"useAdvancedSearch": {
			get () {
				return this.$store.getters["advancedFilters/useAdvancedSearch"];
			},
			set (val) {
				return this.$store.commit("advancedFilters/useAdvancedSearch", val);
			}
		},
		"isAdvancedFiltersModalOpen": {
			get() {
				return this.$store.getters["utilities/isAdvancedFiltersModalOpen"];
			},
			set(val) {
				return this.$store.commit("utilities/isAdvancedFiltersModalOpen", val);
			}
		},
		"advancedFilters": function () {
			return this.$store.getters["advancedFilters/advancedFilters"];
		},
		"eventsCount": function () {
			return this.$store.getters["privateEvents/totalEventsCount"];
		},
		"events": function () {
			return this.$store.getters["privateEvents/eventItems"];
		},
		"pagination": {
			get() {
				return this.$store.getters["privateEvents/pagination"];
			},
			set(val) {
				this.$store.commit("privateEvents/pagination", val);
			}
		},
		"hasNextPage": function () {
			return this.eventsCount > (this.pagination.skip + this.pagination.limit);
		},
		"isLoading": {
			get() {
				return this.$store.getters["privateEvents/isLoading"];
			},
			set(val) {
				this.$store.commit("privateEvents/isLoading", val);
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
		"useAdvancedSearch": function () {
			this.pagination = {
				...this.pagination,
				"skip": 0
			};
			return this.performRelevantQuery();
		},
		"filterText": function (newValue) {
			if (this.isLoading) {
				return false;
			}
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
					if (newValue.length >= 2 && Date.now() - this.debounce >= 300) {
						this.handleAsyncSearch({
							"filteringField": this.selectedFilteringField,
							"orderBy": this.selectedSortingField,
							"orderDirection": this.selectedSortingDirectionCode,
							"filteringValue": newValue
						});
					}
				}, 300);
			}
		},
		hasNextPage(newValue) {
			if (newValue) {
				this.$parent.$refs.scroller.addEventListener("scroll", this.handleScroll);
			} else {
				this.$parent.$refs.scroller.removeEventListener("scroll", this.handleScroll);
			}
		}
	},
	"methods": {
		handleScroll(ev) {
			if (!this.scrollDebounce || Date.now() - this.scrollDebounce >= 300) {
				if (ev.srcElement.scrollTop + ev.srcElement.offsetHeight >= (ev.srcElement.scrollHeight - 150)) {
					this.scrollDebounce = Date.now();
					this.updatePagination();
				}
			}
		},

		openAdvancedFiltersModal() {
			this.isAdvancedFiltersModalOpen = true;
		},

		removeFilters() {
			this.$store.commit("advancedFilters/removeFilters");
		},

		async loadEvents(isPagination) {
			return await Promise.all([
				this.$store.dispatch("privateEvents/retrieveTotalEventsCount"),
				this.$store.dispatch("privateEvents/retrieveEvents", {
					isPagination
				})
			]);
		},

		async searchEvents(isPagination) {
			return await this.$store.dispatch(
				"privateEvents/searchEvents",
				{
					"filterColumn": this.asyncFilterColumn,
					"filterText": this.asyncFilterText,
					isPagination
				}
			);
		},

		async advancedSearchEvents(isPagination) {
			return await this.$store.dispatch(
				"privateEvents/advancedSearchEvents",
				{
					"filterColumn": this.asyncFilterColumn,
					"filterText": this.asyncFilterText,
					isPagination,
					"advancedFilters": this.advancedFilters
				}
			);
		},
		async performRelevantQuery(isPagination) {
			if (this.isLoading) {
				return false;
			}
			this.isLoading = true;

			if (this.useAdvancedSearch) {
				await this.advancedSearchEvents(isPagination);
			} else {
				await (this.asyncFilterText ? this.searchEvents(isPagination) : this.loadEvents(isPagination));
			}



			this.isLoading = false;
			await this.$nextTick(() => {
				this.$refs.searchInput.$refs.input.focus();
			})
			return true;
		},

		async updatePagination() {
			this.eventsLoading = true;
			this.pagination = {
				...this.pagination,
				"skip": this.events.length
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
	},

	unmounted () {
		try {
			this.$parent.$refs.scroller.removeEventListener("scroll", this.handleScroll);
		} catch {
			return false;
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.flip-list-move {
	transition: transform 0.5s;
}

.no-move {
	transition: transform 0s;
}
</style>
