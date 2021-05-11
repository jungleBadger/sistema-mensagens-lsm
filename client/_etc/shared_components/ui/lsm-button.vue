<template>

	<button
		:disabled="isLoading"
		:aria-disabled="isLoading"
		:class="{
			'bg-blue-600 hover:bg-blue-700 active:bg-blue-500': type === 'regular',
			'bg-red-600 hover:bg-red-700 active:bg-red-500': type === 'danger'
		}"
		class="group relative py-2 px-4 border flex justify-between items-center
		bg-blue-600 hover:bg-blue-700 active:bg-blue-500
		border-transparent text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2
	focus:ring-indigo-500 disabled:opacity-50  transition-colors"

		v-bind="$attrs">


		<span>{{label}}</span>

		<template v-if="isLoading">
			<font-awesome-icon
				spin
				:icon="['fas', 'spinner-third']" />
		</template>
		<template v-else-if="iconId">
			<font-awesome-icon
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


		"type": {
			"type": String,
			"required": false,
			"default": function () {
				return "regular";
			},
			"validator": value => ["regular", "danger"].indexOf(value) !== -1

		},


	}
}
</script>