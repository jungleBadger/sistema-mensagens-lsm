<template>

	<div
		class="max-w-full relative"
		:key="id">
		<label class="flex items-center">
			<input
				ref="input"
				v-bind="$attrs"
				:id="id"
				type="checkbox"
				class="form-checkbox rounded-none border border-gray-300
			 focus:outline-none focus:ring-indigo-500
			focus:border-indigo-500 focus:z-10 sm:text-sm"
				:value="modelValue"
				:checked="modelValue"
				@change="() => $emit('update:modelValue', !modelValue)">
			<span class="ml-2">{{label}}</span>
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