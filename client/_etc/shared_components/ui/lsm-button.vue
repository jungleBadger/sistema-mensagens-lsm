<template>

	<Component
		:is="href ? 'a' : to ? 'router-link' : 'button'"
		:to="to"
		:href="href"
		:aria-disabled="isLoading"
		style="min-width: 90px;"
		:class="{
			'bg-white text-gray-800 border border-gray-800 hover:bg-gray-200 active:bg-gray-300': !iconOnly && kind === 'tertiary',
			'bg-gray-800 hover:bg-blue-700 active:bg-blue-500': !iconOnly && kind === 'secondary',
			'bg-blue-600 hover:bg-blue-700 active:bg-blue-500': !iconOnly && kind === 'primary',
			'bg-red-600 hover:bg-red-700 active:bg-red-500': !iconOnly && kind === 'danger',
			'border-blue-600 text-blue-500 hover:bg-blue-200 active:bg-blue-100': !iconOnly && kind === 'primary-outline',
			'border-red-600 text-red-500 hover:bg-red-200 active:bg-red-100': !iconOnly && kind === 'danger-outline',
			'bg-white hover:bg-gray-100 active:bg-gray-200': iconOnly
		}"
		:disabled="isLoading"
		class="group relative py-2 px-2 border gap-2 flex justify-between items-center
		border-transparent text-sm font-medium rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 disabled:opacity-50 transition-colors"
		v-bind="$attrs"
	>


		<span v-if="!iconOnly">{{ label }}</span>

		<template v-if="isLoading">
			<font-awesome-icon
				:icon="['fas', 'spinner-third']"
				spin/>
		</template>
		<template v-else-if="iconId">
			<font-awesome-icon
				:class="{
					'text-blue-500': iconOnly && kind === 'primary',
					'text-red-500': iconOnly && kind === 'danger'
				}"
				:icon="[iconStyle, iconId]">
			</font-awesome-icon>
		</template>


	</Component>


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
				return "primary";
			},
			"validator": value => ["primary", "primary-outline", "secondary", "tertiary", "danger", "danger-outline"].indexOf(value) !== -1

		},

		"href": {
			"type": [String, Object],
			"required": false
		},

		"to": {
			"type": [String, Object],
			"required": false
		}

	}
};
</script>