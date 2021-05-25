<template>

	<div
		class="max-w-full relative"
		:key="id">
		<label
			class="sr-only"
			:for="id">
			{{label}}
		</label>
		<textarea
			ref="input"
			class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
			placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500
			focus:border-indigo-500 focus:z-10 sm:text-sm"
			:maxlength="maxLength || 10000"
			v-bind="$attrs"
			:id="id"
			:value="modelValue"
			@input="(event) => $emit('update:modelValue', event.target.value)"
		/>
		<span
			class="float-right"
			v-if="maxLength">{{modelValue.length}}/{{maxLength}}</span>

	</div>


</template>
<script>


import { v4 as uuidv4 } from 'uuid';

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
			"type": Number,
			"required": false,
			"default": function() {
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
	mounted () {
		if (this.$attrs.hasOwnProperty("autofocus")) {
			window.setTimeout(() => {
				this.$refs.input.focus();
			}, 300);

		}

	}
}
</script>