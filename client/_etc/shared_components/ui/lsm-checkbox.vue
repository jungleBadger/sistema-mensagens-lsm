<template>

	<div
		class="max-w-full relative"
		:key="id">









		<label class="flex gap-2 h-10 items-center cursor-pointer hover:bg-gray-200 p-1">
			<input
				ref="input"
				v-bind="$attrs"
				:id="id"
				type="checkbox"
				class="h-full cursor-pointer rounded-sm w-10 shadow-sm form-checkbox rounded-none border border-gray-300
			 focus:outline-none focus:ring-indigo-500
			focus:border-indigo-500 focus:z-10 sm:text-sm"
				:value="modelValue"
				:checked="modelValue"
				@change="() => $emit('update:modelValue', !modelValue)">
			<span>{{label}}</span>
		</label>

	</div>


</template>
<script>


import { v4 as uuidv4 } from 'uuid';

export default {
	"name": "LsmCheckbox",
	"inheritAttrs": false,
	"props": {

		"modelValue": {
			"type": [String, Number, Boolean],
			"required": false,
			"default": function () {
				return false;
			}
		},

		"label": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		},

		"id": {
			"type": String,
			"required": false,
			"default": function () {
				return uuidv4();
			}
		}
	},
	mounted () {
		if (this.$attrs.hasOwnProperty("autofocus")) {
			window.setTimeout(() => {
				this.$refs.input.focus();
			}, 300);

		}

	}
}
</script>