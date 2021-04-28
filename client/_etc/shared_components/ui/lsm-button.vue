<template>


	<button
		@click="!isLoading ? $emit('click', $event) : () => null"
		v-bind="$attrs"
		class="group bg-blue-600 hover:bg-blue-700 relative w-full py-2 px-4 border flex justify-between items-center
		border-transparent text-sm font-medium rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-2
		focus:ring-indigo-500">


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


	}
}
</script>