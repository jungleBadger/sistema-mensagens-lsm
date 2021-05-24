<template>

	<nav
		class="flex gap-1"
		aria-label="Tab navigation">

		<button
			v-for="tab in tabs"
			:id="tab.id"
			:aria-selected="selectedTab === tab.id"
			:class="{'cursor-default text-blue-500 font-semibold border-blue-500': selectedTab === tab.id}"
			@click="() => $emit('select', tab.id)"
			class="p-2 bg-transparent transition-colors border-b-2 text-gray-600 hover:bg-gray-300 active:bg-gray-400 border-transparent cursor-pointer flex gap-2 items-center">
			<span v-if="tab.icon">
				<font-awesome-icon :icon="tab.icon" />
			</span>
			<span class="relative">{{tab.label}}</span>
		</button>

	</nav>


</template>
<script>

export default {
	"name": "LsmTabsHeader",
	"emits": ["select"],
	"props": {

		"tabs": {
			"type": Array,
			"required": false,
			"default": function () {
				return [];
			}
		},

		"selectedTab": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		}

	}
}
</script>