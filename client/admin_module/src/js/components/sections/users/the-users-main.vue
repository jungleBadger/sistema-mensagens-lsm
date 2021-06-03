<template>
	<section
		aria-label="Irmãos registrados no sistema"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative">
		<header class="flex mb-1 pl-2 pr-2 flex-col md:flex-row md:pl-0 md:pr-0 gap-2">

			<div class="flex flex-col gap-0 flex-1">


				<h3 class="text-2xl">Gerenciamento de Usuários</h3>
				<h4 class="text-l">
					Usuários do sistema são divididos entre Administradores e Regulares.
				</h4>


				<div class="w-full flex gap-2">
					<lsm-tabs-header
						aria-label="Navegação entre tipos de usuário"
						:tabs="tabs"
						:selected-tab="selectedTab"
						@select="selectTab">

					</lsm-tabs-header>
				</div>
			</div>

<!--			<lsm-button-->
<!--				label="Criar usuário"-->
<!--				class="w-40 h-10 self-end"-->
<!--				icon-style="fas"-->
<!--				icon-id="plus"-->
<!--				@click="openCreateModal">-->
<!--			</lsm-button>-->
		</header>



		<template v-if="selectedTab === 'admin'">
			<the-admin-users-fragment></the-admin-users-fragment>

		</template>
		<template v-else>
			<the-regular-users-fragment></the-regular-users-fragment>
		</template>




	</section>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";
import LsmTable from "../../../../../../_etc/shared_components/ui/lsm-table.vue";
import fade from "../../../../../../_etc/shared_mixins/fade";
import LsmButton from "../../../../../../_etc/shared_components/ui/lsm-button.vue";
import TheAdminUsersFragment from "./admin/the-admin-users-fragment.vue";
import TheRegularUsersFragment from "./regular/the-regular-users-fragment";
import LsmTabsHeader from "../../../../../../_etc/shared_components/ui/tabs/lsm-tabs-header";

export default defineComponent({
	"name": "TheUsersMain",
	"mixins": [
		fade
	],
	"components": {
		LsmTabsHeader,
		TheRegularUsersFragment,
		LsmButton,
		LsmTable,
		TheAdminUsersFragment
	},
	"data": function () {
		return {

		}
	},
	"computed": {
		"selectedTab": {
			get() {
				return this.$store.getters["users/selectedTab"]
			},
			set(val) {
				return this.$store.commit("users/selectedTab", val);
			}
		}
	},
	"methods": {
		openCreateModal() {
			return false;
		},
		selectTab(tab) {
			this.selectedTab = tab;
		}
	},
	setup() {
		return {
			"tabs": [
				{
					"id": "admin",
					"label": "Administradores",
					"icon": ["fas", "user-crown"]
				},
				{
					"id": "regular",
					"label": "Regulares",
					"icon": ["fas", "user"]
				}
			]
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
