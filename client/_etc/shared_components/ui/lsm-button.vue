<template>

	<button
		v-bind="$attrs"
		:aria-disabled="isLoading"
		:class="{
			'bg-blue-600 hover:bg-blue-700 active:bg-blue-500': !iconOnly && kind === 'regular',
			'bg-red-600 hover:bg-red-700 active:bg-red-500': !iconOnly && kind === 'danger',
			'bg-white hover:bg-gray-100 active:bg-gray-200': iconOnly
		}"
		:disabled="isLoading"
		class="group relative py-2 px-4 border flex justify-between items-center
		border-transparent text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 disabled:opacity-50 transition-colors">


		<span v-if="!iconOnly">{{ label }}</span>

		<template v-if="isLoading">
			<font-awesome-icon
				:icon="['fas', 'spinner-third']"
				spin/>
		</template>
		<template v-else-if="iconId">
			<font-awesome-icon
				:class="{
					'text-blue-500': iconOnly && kind === 'regular',
					'text-red-500': iconOnly && kind === 'danger'
				}"
				:icon="[iconStyle, iconId]">
			</font-awesome-icon>
		</template>


	</button>


</template>
<script>

export default {
	"name": "LsmButton",

	"props": {

		"label": {
			"type": String,
			"required": false,
			"default": function () {
				return "Click";
			}
		},

		"iconOnly": {
			"type": Boolean,
			"required": false,
			"default": function () {
				return false;
			}
		},

		"iconStyle": {
			"type": String,
			"required": false,
			"default": function () {
				return "fas";
			}
		},

		"iconId": {
			"type": String,
			"required": false
		},

		"isLoading": {
			"type": Boolean,
			"required": false,
			"default": function () {
				return false;
			}
		},

		"kind": {
			"type": String,
			"required": false,
			"default": function () {
				return "regular";
			},
			"validator": value => ["regular", "danger"].indexOf(value) !== -1

		}

	}
};
</script>