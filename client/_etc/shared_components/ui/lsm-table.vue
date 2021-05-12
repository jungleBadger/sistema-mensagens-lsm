<template>

	<div
		:id="id"
		class="h-full flex flex-col overflow-hidden">

		<!--			@SECTION TABLE FILTERS -->

		<header class="bg-gray-100 flex gap-2 items-center shadow z-10 p-2 flex-wrap">

			<div class="w-full md:w-48">
				<lsm-select
					v-model="selectedFilteringField"
					:model-value="selectedFilteringField"
					:options="filteringFields"
					:disabled="isAsyncLoading"
					label="Selecione um campo para filtrar a tabela.">
				</lsm-select>

			</div>

			<div
				class="flex-1"
				style="min-width: 240px;">
				<lsm-input
					:key="selectedFilteringField"
					:disabled="isAsyncLoading"
					v-model="filterText"
					autofocus
					placeholder="Digite para filtrar a tabela."
					type="search">
				</lsm-input>

			</div>

		</header>

		<!--			@SECTION TABLE BODY -->

		<template v-if="filteredData.length">
			<div
				class="bg-white max-h-full overflow-hidden flex flex-col p-0 md:p-1 ml-px ml-px"
				role="table">

				<!--			@SECTION TABLE COLUMNS HEADER -->
				<div
					class="w-full sr-only md:not-sr-only"
					role="rowgroup">
					<div
						class="w-full flex"
						role="row">
						<button
							v-for="column in columnsData"
							:id="column.key"
							:key="column.key"
							:aria-label="column.label"
							:style="{'flex-basis': column.size || 'auto'}"
							@click="changeSortingOptions(column.key, selectedSortingDirection === 'asc' ? 'desc' : 'asc')"
							class="flex-1 flex items-center gap-1 hover:bg-gray-200 transition-colors"
							role="columnheader">

							<template v-if="selectedSortingField === column.key">
								<template v-if="selectedSortingDirection === 'asc'">
									<font-awesome-icon :icon="['fal', 'arrow-up-short-wide']" />
								</template>
								<template v-else>
									<font-awesome-icon :icon="['fal', 'arrow-down-short-wide']" />
								</template>

							</template>
							<span>
								{{ column.label }}
							</span>

						</button>


					</div>
				</div>


				<!--			@SECTION TABLE SCROLLER -->
				<transition-group
					class="w-full max-w-full overflow-y-auto overflow-x-hidden flex-1 flex flex-col"
					name="list"
					role="rowgroup"
					tag="div">
					<!--			@SECTION TABLE ROWS -->

					<Component
						:is="handleClick ? 'button' : 'div'"
						v-for="item in filteredData"
						:key="item.id"
						class="row-item max-w grid flex-col md:flex-row md:flex border-b-2 border-gray-300 md:border-b-0"
						@click="emitClick(item)"
						:class="{'hover:bg-gray-200 active:bg-gray-300 cursor-pointer': handleClick}"
						role="row">

					 <span
						 v-for="column in columnsData"
						 :key="column.key"
						 :aria-labelledby="column.key"
						 :style="{'flex-basis': column.size || 'auto'}"
						 class="flex-1 h-8 overflow-hidden overflow-ellipsis ml-0.5"
						 role="cell">
							<template v-if="column.type === 'date' ">

								<i18n-d
									:format="{ 'key': 'shortWithTime' }"
									:value="item[column.key]"
								></i18n-d>

							</template>
							<template v-else>
								{{ item[column.key]  || "-" }}
							</template>

					  </span>
					</Component>
				</transition-group>
			</div>
		</template>
		<template v-else>
			<div
				class="bg-white pl-2 pr-2 pb-4 pt-4"
				:key="'empty-container'">
				<template v-if="filterText">
					Nenhum item encontrado aplicando os filtros selecionados. <button @click="resetFilters" class="text-blue-500 ml-2">Limpar filtros</button>
				</template>
				<template v-else>
					Tabela sem items. As razões podem variar, mas nenhum resultado foi encontrado pelo sistema.
				</template>
			</div>
		</template>


		<!--			@SECTION TABLE FOOTER -->
		<footer class="bg-gray-100 flex justify-between gap-2 items-center shadow z-10 p-2 flex-wrap">


			<div class="flex flex-1 gap-4">
				<div class="flex gap-1 flex-col items-start md:items-center md:flex-row">
					<label>Itens por página</label>
					<div class="w-16">
						<lsm-select
							:model-value="itemsPerPage"
							:options="itemsPerPageOptions"
							:disabled="isAsyncLoading"
							label="Quantidade de itens por página:"
							@change="updateItemsPerPage"
						></lsm-select>
					</div>
				</div>

				<div class="flex gap-1 flex-col items-start md:items-center md:flex-row">
					<label>Página selecionada</label>
					<div class="w-24">
						<lsm-select
							:model-value="currentPage"
							:options="pageOptions"
							:disabled="isAsyncLoading"
							label="Página selecionada:"
							@change="selectPage"
						></lsm-select>
					</div>
				</div>
			</div>


			<template v-if="pageLimits">

				<div>
					<button
						v-if="isPaginationLeftEnabled"
						class="w-8 h-8"

						title="Clique para carregar página anterior de resultados."
						@click="paginateLeft">
						<font-awesome-icon
							:icon="['fal', 'chevron-left']">

						</font-awesome-icon>
					</button>


					<span class="text-lg"><i18n-n :value="pageLimits.start" format="integer"></i18n-n> - <i18n-n :value="pageLimits.end"
																								 format="integer"></i18n-n> de <i18n-n
						:value="totalItemsCount" format="integer"></i18n-n></span>

					<button
						v-if="isPaginationRightEnabled"
						class="w-8 h-8"
						title="Clique para carregar próxima página de resultados."
						@click="paginateRight">
						<font-awesome-icon
							:icon="['fal', 'chevron-right']">

						</font-awesome-icon>
					</button>
				</div>

			</template>

		</footer>

	</div>


</template>
<script type="text/javascript">


import { v4 as uuidv4 } from "uuid";
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import LsmInput from "./lsm-input.vue";
import LsmSelect from "./lsm-select.vue";

export default defineComponent({
	"name": "LsmTable",
	"components": {
		LsmInput,
		LsmSelect
	},
	"emits": ["paginate", "select"],
	"props": {

		"id": {
			"type": String,
			"required": false,
			"default": function () {
				return uuidv4();
			}
		},

		"handleClick": {
			"type": Boolean,
			"required": false,
			"default": function () {
				return false;
			}
		},

		"isAsyncLoading": {
			"type": Boolean,
			"required": false,
			"default": function () {
				return false;
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
			"validator": value => ["asc", "desc"].indexOf(value) !== -1
		}

	},
	"data": function () {
		return {
			"itemsPerPageOptions": [
				{
					"id": 5,
					"label": "5"
				},
				{
					"id": 20,
					"label": "20"
				},
				{
					"id": 50,
					"label": "50"
				},
				{
					"id": 100,
					"label": "100"
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
		"filteringFields": function () {
			return [
				{
					"id": "all",
					"label": "Todos os campos"
				},
				...this.columnsData.map(item => {
					return {
						"id": item.key,
						"label": item.label
					}
				})
			]
		},
		"filteredData": function () {
			let result = (
				(this.filterText ?
						this.tableItems.filter(item => {
							return JSON.stringify(
								item,
								this.selectedFilteringField === "all" ? null : [this.selectedFilteringField]
							).toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
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
				});
			}

			return result;
		},

		"numberOfPages": function () {
			if (this.totalItemsCount && this.itemsPerPage) {
				return Math.ceil(this.totalItemsCount / this.itemsPerPage) || 1;
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

		"pageOptions": function () {
			return this.numberOfPages > 1 ? Array(this.numberOfPages).fill(null).map((item, index) => {
				return {
					"id": index + 1,
					"label": `${index + 1}/${this.numberOfPages}`
				};
			}) : [{
				"id": 1,
				"label": "1/1"
			}];
		},

		"isPaginationLeftEnabled": function () {
			return this.pageLimits ? this.pageLimits.start > this.itemsPerPage : false;
		},

		"isPaginationRightEnabled": function () {
			return this.pageLimits ? this.pageLimits.end < this.totalItemsCount : false;
		}
	},
	"methods": {

		resetFilters() {
			this.selectedFilteringField = "all";
			this.filterText = "";
		},

		changeSortingOptions(field, direction) {
			this.selectedSortingField = field;
			this.selectedSortingDirection = direction;
		},

		emitClick(selectedItem) {
			if (this.handleClick) {
				this.$emit("select", selectedItem);
			}
		},

		selectPage (event) {
			this.currentPage = Number(event.target.value);
			this.$emit("paginate", {
				"skip": this.pageLimits.start - 1,
				"limit": this.itemsPerPage
			});
		},

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
			this.currentPage = 1;
			this.$emit("paginate", {
				"skip": 0,
				"limit": Number(event.target.value)
			});

		}
	},

	setup (props) {
		const {
			datetimeFormats,
			numberFormats
		} = useI18n();

		return {
			datetimeFormats,
			numberFormats,
			"selectedSortingField": ref(props.sortingField),
			"selectedSortingDirection": ref(props.sortingDirection)
		};
	}
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

@media screen and (max-width: 768px) {
	.row-item:last-child  {
		border-bottom: 0 !important;
	}
}
</style>