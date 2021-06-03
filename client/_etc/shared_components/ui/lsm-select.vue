<template>

	<div
		class="max-w-full relative"
		:key="id">
		<label
			class="sr-only"
			:for="id">
			{{label}}
		</label>

		<select
			ref="input"
			class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
			placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 h-10
			focus:border-indigo-500 focus:z-10 sm:text-sm"
			v-bind="$attrs"
			@change="(event) => $emit('update:modelValue', event.target.value)"
			:id="id"
			:value="modelValue">

			<option value="" disabled>{{label}}</option>
			<option
				v-for="option in options"
				:key="option.id"
				:value="option.originalId || option.id">
				{{option.label}}
			</option>
		</select>

	</div>
</template>
<script>


import { v4 as uuidv4 } from 'uuid';

export default {
	"name": "LsmSelect",
	"inheritAttrs": false,
	"props": {

		"modelValue": {
			"type": [Number, String],
			"required": false,
			"default": function () {
				return "";
			}
		},

		"label": {
			"type": String,
			"required": false,
			"default": function () {
				return "Selecione uma opção";
			}
		},

		"options": {
			"type": Array,
			"required": true,
			"validator": val => val.every(item => item.id && item.label)
		},

		"id": {
			"type": String,
			"required": false,
			"default": function () {
				return uuidv4();
			}
		}
	},
	"data": function () {
		return {
		}
	},
	"methods": {
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