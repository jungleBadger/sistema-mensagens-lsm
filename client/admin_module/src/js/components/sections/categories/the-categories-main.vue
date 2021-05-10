<template>
	<section
		aria-label="Administração de categorias"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative gap-4">
		<header class="flex gap-4">
			<div class="flex flex-col gap-2 flex-1">

				<h3 class="text-2xl">Gerenciamento de Categorias</h3>
				<h4 class="text-l">
					Categorias são utilizadas para o registro de <router-link class="text-blue-700" :to="{'name': 'app.events'}">Eventos</router-link>.
				</h4>

			</div>
		</header>


	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";

export default defineComponent({
	"name": "TheCategoriesMain",
	"components": {
	},
	"data": function () {
		return {

		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
