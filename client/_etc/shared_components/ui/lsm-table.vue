<template>

	<div
		:id="id"
		class="h-full flex flex-col overflow-hidden shadow-lg">

		<!--			@SECTION TABLE FILTERS -->

		<header class="bg-gray-300 flex gap-1 items-center shadow z-20 p-1.5 flex-wrap">

			<div class="w-full md:w-48">
				<lsm-select
					v-model="selectedFilteringField"
					:disabled="isAsyncLoading"
					:model-value="selectedFilteringField"
					:options="filteringFields"
					label="Selecione um campo para filtrar a tabela.">
				</lsm-select>

			</div>

			<div
				class="flex-1"
				style="min-width: 240px;">
				<lsm-input
					v-model="filterText"
					:placeholder="isAsyncSearchEnabled ? 'Digite 03 caracteres ou mais para buscar.' : 'Digite para filtrar a tabela.'"
					autofocus
					type="search">
				</lsm-input>
			</div>


		</header>


		<!--			@SECTION TABLE BODY -->

		<div
			class="bg-white max-h-full overflow-hidden flex flex-col p-0 md:p-2 md:pt-0 md:pb-0 ml-px ml-px relative"
			role="table">

			<lsm-progress-bar v-if="isAsyncLoading"></lsm-progress-bar>

			<template v-if="filteredData.length">
				<div
					class="w-full z-10 sr-only md:not-sr-only"
					role="rowgroup">
					<div
						class="w-full flex"
						role="row">
						<button
							v-for="column in columnsData"
							:id="`th-${column.key}`"
							:key="column.key"
							:aria-label="column.label"
							:style="{'flex-basis': column.size || 'auto'}"
							class="flex-1 flex items-center gap-1 hover:bg-gray-200 transition-colors"
							role="columnheader"
							@click="changeSortingOptions(column.originalId || column.key, selectedSortingDirectionCode === 'ASC' ? 'DESC' : 'ASC')">

							<template v-if="selectedSortingField === (column.originalId || column.key)">
								<template v-if="selectedSortingDirectionCode === 'ASC'">
									<font-awesome-icon :icon="['fal', 'arrow-up-short-wide']"/>
								</template>
								<template v-else>
									<font-awesome-icon :icon="['fal', 'arrow-down-short-wide']"/>
								</template>

							</template>
							<span>
								{{ column.label }}
							</span>

						</button>

						<span
							v-if="enableDeleteButton"
							class="flex items-center gap-1"
							role="columnheader"
							style="flex-basis: 80px;">
							<span></span>
						</span>

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
						:class="{'hover:bg-gray-200 active:bg-gray-300 cursor-pointer': handleClick}"
						class="row-item max-w grid flex-col md:flex-row md:flex border-b-2 border-gray-300 md:border-b-0 hover-trigger"
						role="row"
						@click="emitClick(item)">
						<span
							v-for="column in columnsData"
							:key="column.key"
							:aria-labelledby="`th-${column.key}`"
							:title="item[column.key] || 'Vazio'"
							:style="{'flex-basis': column.size || 'auto'}"
							class="flex-1 h-8 overflow-hidden overflow-ellipsis ml-0.5 whitespace-nowrap"
							role="cell">
							<template v-if="column.type === 'date' ">
								<i18n-d
									:value="item[column.key]"
									:format="column.parser ? column.parser : 'shortWithTime'"
									locale="pt"
									tag="span"
								></i18n-d>

							</template>
							<template v-else-if="column.type === 'boolean' ">
									<font-awesome-icon :icon="['fal', item[column.key] ? 'check' : 'xmark']"></font-awesome-icon>
							</template>
							<template
								v-else>
								{{ item[column.key] || "-" }}
							</template>
						</span>

						<span
							v-if="enableDeleteButton"
							class="h-9 md:h-8 overflow-hidden overflow-ellipsis items-center justify-end md:justify-center"
							role="cell"
							style="flex-basis: 80px;">
							<span
								class="hover-target h-full items-center justify-center">
								<lsm-button
									class="h-8 md:h-6"
									style="min-width:unset;"
									icon-id="trash-xmark"
									icon-only
									icon-style="fas"
									kind="danger"
									@click.stop="emitDeleteRequest(item)"
								></lsm-button>
							</span>

						</span>
					</Component>
				</transition-group>
			</template>
			<template v-else>
				<div
					:key="'empty-container'"
					class="bg-white pl-2 pr-2 pb-4 pt-4">
					<template v-if="isAsyncLoading">
						Carregando dados...
					</template>
					<template v-else-if="filterText">
						Nenhum item encontrado aplicando os filtros selecionados.
						<button class="text-blue-500 ml-2" @click="resetFilters">Limpar filtros</button>
					</template>
					<template v-else>
						Tabela sem items. As razões podem variar, mas nenhum resultado foi encontrado pelo sistema.
					</template>
				</div>
			</template>

		</div>


		<!--			@SECTION TABLE FOOTER -->
		<footer class="bg-gray-300 flex justify-between gap-1 items-center shadow z-10 p-1.5 flex-wrap text-sm">


			<div class="flex flex-1 gap-4">
				<div class="flex gap-1 flex-col items-start md:items-center md:flex-row">
					<label>Itens por página</label>
					<div class="w-16">
						<lsm-select
							:disabled="isAsyncLoading"
							:model-value="itemsPerPage"
							:options="itemsPerPageOptions"
							label="Quantidade de itens por página:"
							@change="updateItemsPerPage"
						></lsm-select>
					</div>
				</div>

				<div class="flex gap-1 flex-col items-start md:items-center md:flex-row ">
					<label>Página selecionada</label>
					<div class="w-24">
						<lsm-select
							:disabled="isAsyncLoading"
							:model-value="currentPage"
							:options="pageOptions"
							label="Página selecionada:"
							@change="selectPage"
						></lsm-select>
					</div>
				</div>
			</div>


			<template v-if="pageLimits">

				<div class="text-sm">
					<button
						v-if="isPaginationLeftEnabled"
						class="w-8 h-8"

						title="Clique para carregar página anterior de resultados."
						@click="paginateLeft">
						<font-awesome-icon
							:icon="['fal', 'chevron-left']">

						</font-awesome-icon>
					</button>


					<span class="text-sm"><i18n-n :value="pageLimits.start" format="integer"></i18n-n> - <i18n-n
						:value="pageLimits.end"
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
import LsmProgressBar from "./lsm-progress-bar";
import LsmButton from "./lsm-button";

export default defineComponent({
	"name": "LsmTable",
	"components": {
		LsmButton,
		LsmProgressBar,
		LsmInput,
		LsmSelect
	},
	"emits": ["paginate", "select", "search", "deleteRequest"],
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

		"isAsyncSearchEnabled": {
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

		"orderBy": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		},

		"orderDirection": {
			"type": String,
			"required": false,
			"default": function () {
				return "desc";
			},
			"validator": value => ["ASC", "DESC"].indexOf(value.toUpperCase()) !== -1
		},

		"enableDeleteButton": {
			"type": Boolean,
			"required": false,
			"default": function () {
				return false;
			}
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

			// Links to `orderBy` prop
			"selectedSortingField": "",

			// Links to `orderDirection` prop
			"selectedSortingDirection": "",

			"currentPage": 1,

			"debounce": Date.now()
		};
	},
	"computed": {

		"selectedSortingDirectionCode": function () {
			return (this.selectedSortingDirection || "").toUpperCase();
		},

		"filteringFields": function () {
			return [
				{
					"id": "all",
					"label": "Todos os campos"
				},
				...this.columnsData.map(item => {
					return {
						"id": item.key,
						"originalId": item.originalId,
						"label": item.label
					};
				})
			];
		},
		"filteredData": function () {

			return (!this.isAsyncSearchEnabled && this.filterText ?
					this.tableItems.filter(item => {
						return JSON.stringify(
							item,
							this.selectedFilteringField === "all" ? null : [this.selectedFilteringField]
						).toLowerCase().indexOf(this.filterText.toLowerCase()) > -1;
					}) :
					this.tableItems.map(item => item)
			);

			// if (this.selectedSortingField) {
			// 	result.sort((a, b) => {
			// 		if (this.selectedSortingDirectionCode === "DESC") {
			// 			return a[this.selectedSortingField] < b[this.selectedSortingField] ? 1 : -1;
			// 		} else {
			// 			return a[this.selectedSortingField] < b[this.selectedSortingField] ? -1 : 1;
			// 		}
			// 	});
			// }
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

		resetFilters () {
			this.selectedFilteringField = "all";
			this.filterText = "";
		},

		emitDeleteRequest (selectedItem) {
			this.$emit("deleteRequest", selectedItem);
		},

		emitClick (selectedItem) {
			if (this.handleClick) {
				this.$emit("select", selectedItem);
			}
		},

		emitPaginate (override = {}) {
			this.$emit("paginate", {
				"filteringField": this.selectedFilteringField,
				"orderBy": this.selectedSortingField,
				"orderDirection": this.selectedSortingDirectionCode,
				"filteringValue": this.filterText,
				"skip": this.pageLimits.start - 1,
				"limit": this.itemsPerPage,
				...override
			});
		},

		// All of the following methods represent data handling changes and re-trigger the pagination event
		changeSortingOptions (field, direction) {
			this.selectedSortingField = field;
			this.selectedSortingDirection = direction;
			this.emitPaginate();
		},

		selectPage (event) {
			this.currentPage = Number(event.target.value);
			this.emitPaginate();
		},

		paginateLeft () {
			this.currentPage -= 1;
			this.emitPaginate();
		},

		paginateRight () {
			this.currentPage += 1;
			this.emitPaginate();
		},

		updateItemsPerPage (event) {
			this.currentPage = 1;
			this.emitPaginate({
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
			"selectedSortingField": ref(props.orderBy),
			"selectedSortingDirection": ref(props.orderDirection)
		};
	},

	"watch": {
		"filterText": function (newValue) {
			if (this.isAsyncSearchEnabled) {
				this.currentPage = 1;
				this.debounce = Date.now();
				if (!newValue) {
					this.$emit("search", {
						"filteringField": this.selectedFilteringField,
						"orderBy": this.selectedSortingField,
						"orderDirection": this.selectedSortingDirectionCode,
						"filteringValue": ""
					});
				} else {
					setTimeout(() => {
						if (newValue.length >= 2 && Date.now() - this.debounce >= 300) {
							this.$emit("search", {
								"filteringField": this.selectedFilteringField,
								"orderBy": this.selectedSortingField,
								"orderDirection": this.selectedSortingDirectionCode,
								"filteringValue": newValue
							});
						}
					}, 300);
				}
			}
		}
	}
});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.hover-trigger {
	.hover-target {
		display: none;
	}

	&:hover {
		.hover-target {
			display: flex;
		}

	}
}

@media screen and (max-width: 768px) {
	.hover-trigger {
		.hover-target {
			display: block;
		}
	}
	.row-item:last-child {
		border-bottom: 0 !important;
	}
}
</style>