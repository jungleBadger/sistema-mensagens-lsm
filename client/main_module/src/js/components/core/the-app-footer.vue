<template>
	<footer
		style="z-index: 52; background-color: #193f64; justify-content: space-between; "
		class="w-full flex min-h-12 shadow p-4 text-white flex-wrap gap-2">

		<div class="flex flex-col gap-1 md:w-auto w-full">
			<span class="font-semibold">{{new Date().getFullYear()}} - Restaurados à Bíblia</span>
		</div>
	</footer>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";

export default defineComponent({
	"name": "TheAppFooter"
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">



.fa-instagram {
	background: #d6249f;
	background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-size: 30px;
}

</style>
