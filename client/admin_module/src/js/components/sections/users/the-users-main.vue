<template>
	<section
		aria-label="Irmãos registrados no sistema"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative">

		<header class="flex mb-3 pl-2 pr-2 pt-2 flex-col md:flex-row md:pl-0 md:pr-0 md:pt-2 gap-2">
			<div class="flex flex-col gap-2 flex-1">

			<h3 class="text-2xl">Gerenciamento de Usuários</h3>
				<h4 class="text-l">
					Usuários do sistema são divididos entre Administradores e Regulares.
				</h4>

			</div>

<!--			<lsm-button-->
<!--				label="Criar Irmão"-->
<!--				class="w-40"-->
<!--				icon-style="fas"-->
<!--				icon-id="plus"-->
<!--				@click="openCreateModal">-->
<!--			</lsm-button>-->
		</header>

		<template>

		</template>

		<the-admin-users-fragment></the-admin-users-fragment>




	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../_etc/shared_components/ui/lsm-table.vue";
import fade from "../../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button.vue";
import TheAdminUsersFragment from "./admin/the-admin-users-fragment.vue";

export default defineComponent({
	"name": "TheUsersMain",
	"mixins": [
		fade
	],
	"components": {
		LsmButton,
		LsmTable,
		TheAdminUsersFragment
	},
	"data": function () {
		return {

		}
	},
	"computed": {

	},
	"methods": {
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
