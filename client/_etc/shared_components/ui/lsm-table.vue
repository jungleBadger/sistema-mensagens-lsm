<template>

	<div
		:id="id"
		class="h-full flex flex-col overflow-hidden">

		<!--			@SECTION TABLE FILTERS -->

		<header class="bg-yellow-400">
			<lsm-input
				:key="selectedFilteringField"
				v-model="filterText"
				class="mb-2"
				autofocus
			></lsm-input>
			{{ filterText }}

			<lsm-select
				model-value="selectedFilteringField"
				v-model="selectedFilteringField"
				:options="filteringFields">

			</lsm-select>

		</header>

		<!--			@SECTION TABLE BODY -->

		<main
			class="bg-white max-h-full overflow-hidden flex-1 flex flex-col"
			role="table">

			<!--			@SECTION TABLE COLUMNS HEADER -->

			<div role="rowgroup">
				<div role="row">
				  <span
					  v-for="column in columnsData"
					  :key="column.key"
					  role="columnheader">
					{{ column.label }}
				  </span>
				</div>
			</div>


			<!--			@SECTION TABLE SCROLLER -->
			<div class="overflow-auto flex-1">
				<!--			@SECTION TABLE ROWS -->
				<div
					v-for="item in filteredData"
					:key="item.id"
					role="rowgroup">

					 <span
						 v-for="column in columnsData"
						 :key="column.key"
						 role="cell">
							<template v-if="column.type === 'date' ">

								<i18n-d
									:format="{ key: 'long', era: 'narrow' }"
									:value="item[column.key]"
								></i18n-d>

							</template>
							<template v-else>
								{{ item[column.key] }}
							</template>

					  </span>
				</div>
			</div>


		</main>

		<footer class="w-full bg-yellow-400">

			<button
				v-if="isPaginationLeftEnabled"
				@click="paginateLeft">
				LEFT
			</button>

			<template v-if="pageLimits">

				{{ pageLimits.start }} - {{ pageLimits.end }}
				of
				{{ totalItemsCount }}
			</template>


			<button
				v-if="isPaginationRightEnabled"
				@click="paginateRight">
				RIGHT
			</button>

			<span class="ml-2">
				current page
				{{ currentPage }}
			</span>

			<span class="ml-2">
				x
				{{ pageLimits }}
			</span>

			<span class="ml-2">
				items per page
				{{ itemsPerPage }}
			</span>

			<span class="ml-2">
				total pages
				{{ numberOfPages }}
			</span>


			<span>
				<lsm-select
					:model-value="itemsPerPage"
					:options="[
						{
							'id': 5,
							'label': '5'
						},
						{
							'id': 20,
							'label': '20'
						},
						{
							'id': 50,
							'label': '50'
						},
						{
							'id': 100,
							'label': '100'
						}
					]"
					@change="updateItemsPerPage"
				></lsm-select>
			</span>

		</footer>

	</div>


</template>
<script>


import { v4 as uuidv4 } from "uuid";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import LsmInput from "./lsm-input.vue";
import LsmSelect from "./lsm-select.vue";

export default defineComponent({
	"name": "LsmTable",
	"components": {
		LsmInput,
		LsmSelect
	},
	"emits": ["paginate"],
	"props": {
		"id": {
			"type": String,
			"required": false,
			"default": function () {
				return uuidv4();
			}
		},

		"totalItemsCount": {
			"type": Number,
			"required": false,
			"default": function () {
				return null;
			}
		},

		"itemsPerPage": {
			"type": [String, Number],
			"required": false,
			"default": function () {
				return 5;
			}
		},

		"tableItems": {
			"type": Array,
			"required": true
		},

		"columnsData": {
			"type": Array,
			"required": true,
			"validator": function (columns) {
				return columns.every(column => column.key && column.label);
			}
		},

		"sortingField": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		},

		"sortingDirection": {
			"type": String,
			"required": false,
			"default": function () {
				return "desc";
			},
			"validator": value => ['asc', 'desc'].indexOf(value) !== -1
		},

	},
	"data": function () {
		return {
			"filteringFields": [
				{
					"id": "all",
					"label": "Todos os campos"
				},
				{
					"id": "operator",
					"label": "Operador"
				},
				{
					"id": "action",
					"label": "Ação"
				},
				{
					"id": "referenceTable",
					"label": "Tabela"
				},
				{
					"id": "createdAt",
					"label": "Data da operação"
				}
			],
			"filterText": "",
			"selectedFilteringField": "all",

			"selectedSortingField": "",
			"selectedSortingDirection": "",

			"currentPage": 1
		};
	},
	"computed": {

		"filteredData": function () {
			let result = (
				(this.filterText ?
					this.tableItems.filter(item => {
						return JSON.stringify(
							item,
							this.selectedFilteringField === "all" ? null : [this.selectedFilteringField]
						).indexOf(this.filterText) > -1 ;
					}) :
					this.tableItems.map(item => item)
				)
			);

			if (this.selectedSortingField) {
				result.sort((a, b) => {
					if (this.selectedSortingDirection === "desc") {
						return a[this.selectedSortingField] < b[this.selectedSortingField] ? 1 : -1;
					} else {
						return a[this.selectedSortingField] < b[this.selectedSortingField] ? -1 : 1;
					}
				})
			}

			return result;
		},

		"numberOfPages": function () {
			if (this.totalItemsCount && this.itemsPerPage) {
				return Math.floor(this.totalItemsCount / this.itemsPerPage);
			}
		},

		"pageLimits": function () {
			if (this.numberOfPages) {
				let start = ((this.itemsPerPage * this.currentPage) - this.itemsPerPage) + 1;
				let end = (start - 1) + this.itemsPerPage;
				return {
					"start": start <= this.totalItemsCount ? start : (this.totalItemsCount - this.itemsPerPage),
					"end": end <= this.totalItemsCount ? end : this.totalItemsCount
				};
			}
		},

		"isPaginationLeftEnabled": function () {
			return this.pageLimits ? this.pageLimits.start > this.itemsPerPage : false;
		},

		"isPaginationRightEnabled": function () {
			return this.pageLimits ? this.pageLimits.end < this.totalItemsCount : false;
		}
	},
	"methods": {
		paginateLeft () {
			this.currentPage -= 1;
			this.$emit("paginate", {
				"skip": this.pageLimits.start - 1,
				"limit": this.itemsPerPage
			});
		},

		paginateRight () {
			this.currentPage += 1;
			this.$emit("paginate", {
				"skip": this.pageLimits.start - 1,
				"limit": this.itemsPerPage
			});
		},

		updateItemsPerPage (event) {
			this.$emit("paginate", {
				"skip": 0,
				"limit": event.target.value
			});
		}
	},

	setup (props) {
		const { datetimeFormats } = useI18n();
		return {
			datetimeFormats,
			"selectedSortingField": props.sortingField || props.columnsData[0].key,
			"selectedSortingDirection": props.sortingDirection
		};
	}
});
</script>

<style>

</style>