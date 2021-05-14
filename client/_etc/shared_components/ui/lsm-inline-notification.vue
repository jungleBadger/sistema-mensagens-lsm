<template>

	<transition
		appear
		@enter="fadeIn"
		:css="false">
		<div
			:class="{
			'bg-green-100 text-green-900 border-green-500': kind === 'success',
			'bg-red-100 text-red-900 border-red-500': kind === 'error',
			'bg-yellow-100 text-yellow-900 border-yellow-500': kind === 'warning',
			'bg-gray-100 text-gray-900 border-gray-500': kind === 'info'
		}"
			class="border-t-4 rounded-b px-4 py-3 shadow-md"
			role="alert">
			<div class="flex">
				<div>
					<label class="font-bold">{{title}}</label>
					<p class="text-sm">{{description}}</p>
				</div>

			</div>
		</div>
	</transition>


</template>
<script>


import { v4 as uuidv4 } from 'uuid';
import fade from "../../shared_mixins/fade";

export default {
	"name": "LsmInlineNotification",
	"mixins": [
		fade
	],
	"props": {

		"kind": {
			"type": String,
			"required": false,
			"default": function () {
				return "info"
			},
			"validator": value => ['success', 'info', 'warning', 'error'].indexOf(value) !== -1
		},

		"title": {
			"type": String,
			"required": false,
			"default": function () {
				return "Something wrong happened.";
			}
		},

		"description": {
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
	}
}
</script>