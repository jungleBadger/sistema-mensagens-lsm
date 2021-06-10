<template>

	<div
		:key="id"
		class="max-w-full relative">
		<label
			:for="id"
			class="sr-only">
			{{ label }}
		</label>
		<textarea
			:id="id"
			ref="input"
			v-bind="$attrs"
			:maxlength="maxLength || 10000"
			:value="modelValue"
			class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
			placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500
			focus:border-indigo-500 focus:z-10 sm:text-sm"
			@input="(event) => $emit('update:modelValue', event.target.value)"
			@keydown.enter.exact.prevent
			@keydown.enter.shift.exact="newline"
		/>
		<span
			v-if="maxLength"
			class="float-right text-gray-500 absolute right-0">{{ (modelValue || []).length }}/{{ maxLength }}</span>
	</div>


</template>
<script>


import { v4 as uuidv4 } from "uuid";

export default {
	"name": "LsmTextArea",
	"inheritAttrs": false,
	"props": {

		"modelValue": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		},

		"label": {
			"type": String,
			"required": false,
			"default": function () {
				return "";
			}
		},

		"maxLength": {
			"type": [Number, String],
			"required": false,
			"default": function () {
				return null;
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
	"methods": {
		newline () {
			this.value = `${this.value}\n`;
		}
	},
	mounted () {
		if (this.$attrs.hasOwnProperty("autofocus")) {
			window.setTimeout(() => {
				this.$refs.input.focus();
			}, 300);

		}

	}
};
</script>