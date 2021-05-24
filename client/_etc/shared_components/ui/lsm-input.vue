<template>

	<div
		class="max-w-full relative"
		:key="id">
		<label
			class="sr-only"
			:for="id">
			{{label}}
		</label>
		<input
			ref="input"
			class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
			placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500
			focus:border-indigo-500 focus:z-10 sm:text-sm"
			v-bind="$attrs"
			:id="id"
			:type="revealPasswordField ? 'text' : type"
			:value="modelValue"
			@input="(event) => $emit('update:modelValue', event.target.value)"
		/>

		<aside
			class="absolute right-0 cursor-pointer top-0 bottom-0 flex items-center px-3 text-gray-800"
			@click="togglePasswordField"
			v-if="modelValue && type === 'password'">
			<template v-if="revealPasswordField">
				<font-awesome-icon :icon="['fal', 'eye-slash']"></font-awesome-icon>
			</template>
			<template v-else>
				<font-awesome-icon :icon="['fal', 'eye']"></font-awesome-icon>
			</template>
		</aside>
	</div>


</template>
<script>


import { v4 as uuidv4 } from 'uuid';

export default {
	"name": "LsmInput",
	"inheritAttrs": false,
	"props": {

		"modelValue": {
			"type": [String, Number],
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

		"type": {
			"type": String,
			"required": false,
			"default": function () {
				return "text";
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
	"data": function () {
		return {
			"revealPasswordField": false
		}
	},
	"methods": {
		"togglePasswordField": function () {
			this.revealPasswordField = !this.revealPasswordField;
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