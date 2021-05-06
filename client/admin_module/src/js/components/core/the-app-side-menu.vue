<template>
	<nav
		id="lsm-sidemenu"
		class="bg-white flex flex-col w-12 shadow-sm z-10"
		:class="{'__is-open': isSideMenuOpen}">


		<ul class="flex-1 w-full h-full bg-inherit">

			<router-link
				class="flex items-baseline h-12 gap-1 cursor-pointer text-gray-600 bg-inherit hover:bg-blue-300 hover:text-gray-800 active:bg-blue-400 transition-colors"
				title="Ir para o início"
				:aria-selected="$route.name === 'app.home'"
				:to="{'name': 'app.home'}">

				<span
					role="img"
					aria-labelledby="home-item"
					class="w-12 h-12 text-base flex items-center justify-center"
					style="min-width: 3rem;">
					<font-awesome-icon
						:icon="['fas', 'home']" />
				</span>


				<span
					class="overflow-ellipsis overflow-hidden"
					id="home-item"
					:aria-hidden="!isSideMenuOpen"
					aria-label="Início">Início</span>
			</router-link>

			<hr
				class="border-gray-300 mt-1 mb-1 mr-3 ml-3"
				style="--bg:inherit; --p:0 10px; --trans-x:-50%; --trans-y:-50%;"
				role="separator"
			/>


			<router-link
				class="flex items-baseline h-12 gap-1 cursor-pointer text-gray-600 bg-inherit hover:bg-blue-300 hover:text-gray-800 active:bg-blue-400 transition-colors"
				v-for="item in rootItems"
				:to="item.path"
				:key="item.key"
				:aria-selected="$route.name === item.path.name"
				:title="`Ir para ${item.label}`">

				<span
					role="img"
					:aria-labelledby="item.id"
					class="w-12 h-12 text-base flex items-center justify-center"
					style="min-width: 3rem;">
					<font-awesome-icon
						:icon="['fas', item.meta.icon]" />
				</span>


				<span
					class="overflow-ellipsis overflow-hidden"
					:id="item.id"
					:aria-hidden="!isSideMenuOpen"
					:aria-label="item.label">{{item.label}}</span>
			</router-link>
		</ul>

	</nav>

</template>
<script type="text/javascript">


"use strict";

import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";

export default defineComponent({
	"name": "AppSideMenu",
	"components": {
		LsmInput
	},

	"props": {
		"rootItems": {
			"type": Array,
			"required": false,
			"default": function () {
				return [
					{
						"id": "brothers",
						"label": "Irmãos",
						"path": {
							"name": "app.brothers"
						},
						"meta": {
							"icon": "user-tie"
						},
						"children": []
					},
					{
						"id": "categories",
						"label": "Categorias",
						"path": {
							"name": "app.categories"
						},
						"meta": {
							"icon": "ball-pile"
						},
						"children": []
					},
					{
						"id": "events",
						"label": "Eventos",
						"path": {
							"name": "app.events"
						},
						"meta": {
							"icon": "podcast"
						},
						"children": []
					},
					{
						"id": "users",
						"label": "Usuários",
						"path": {
							"name": "app.users"
						},
						"meta": {
							"icon": "user-group-crown"
						},
						"children": []
					},
					{
						"id": "logs",
						"label": "Logs",
						"path": {
							"name": "app.logs"
						},
						"meta": {
							"icon": "box-archive"
						},
						"children": []
					}
				]
			}
		}
	},


	"computed": {
		"isSideMenuOpen": function () {
			return this.$store.getters["utilities/isSideMenuOpen"];
		}

		// selectedRoute() {
		//
		// }
	},


	setup() {
		return {
			...useI18n()
		}
	},
	mounted () {
		console.log(this.$route)
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

#lsm-sidemenu {
	position: static;
	display: block;
	transition: width 0.33s ease-in, transform 0.33s ease-in 0.33s;
	min-width: 48px;
	max-width: 220px;
	height: 100%;

	[aria-selected="true"] {
		cursor: default;
		background-color: #BFDBFE;
	}

	&.__is-open {
		width: 220px;

		[aria-selected="true"] {
			position: relative;
			background-color: #f4f4f4;

			&::before {
				position: absolute;
				top: 0;
				left: 0;
				display: block;
				content: "";
				width: 6px;
				height: 100%;
				background-color: #BFDBFE;
			}
		}

	}

}

@media screen and (max-width: 768px) {
	#lsm-sidemenu {
		position: absolute;
		height: calc(100% - 48px);
		transform: translateX(-100%);
		background-color: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(2px);

		&.__is-open {
			display: block;
			transform: translateX(0);
			transition: width 0.33s ease-in, transform 0.33s ease-in 0s;

		}
	}
}



</style>
