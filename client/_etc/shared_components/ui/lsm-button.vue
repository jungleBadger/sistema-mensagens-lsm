<template>
	<button
		class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		type="submit">
		<span class="absolute left-0 inset-y-0 flex items-center pl-3">
			<font-awesome-icon :icon="['fas', 'lock']"></font-awesome-icon>
		</span>
		<span>Sign in</span>
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
				return "";
			}
		}
	}
}
</script>