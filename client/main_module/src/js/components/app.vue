<template>

	<section class="flex flex-col flex-1 w-full h-full">
		<the-app-header class="md:pl-12 md:pr-12 pl-2 pr-2">
			<template v-slot:app-buttons>
				<div class="flex gap-4 w-full">
					<div class="pl-2 hidden sm:block">
						<router-link
							:to="{'name': 'app.home'}">
							<img
								class="mx-auto h-10 w-auto"
								src="/_etc/assets/1x/logo.png"
								alt="Logotipo Livro aberto"
								role="img"
							/>
						</router-link>
					</div>
					<div class="pr-2 flex flex-1 gap-6 items-center justify-end overflow-hidden overflow-ellipsis whitespace-nowrap">
						<template v-if="userInfo && userInfo.id">

							<router-link
								class="header-link"
								:to="{'name': 'app.owned'}"><font-awesome-icon :icon="['fas', 'user-music']"/> Meus pedidos e mensagens
							</router-link>

							<router-link
								class="header-link"
								:to="{'name': 'app.owned'}"><font-awesome-icon :icon="['fas', 'user-gear']"/> Perfil
							</router-link>

							<router-link
								class="header-link"
								:to="{'name': 'app.checkout'}"><font-awesome-icon :icon="['fas', 'cart-shopping']"/> Carrinho ({{cartItemsLength}})
							</router-link>
						</template>
						<template v-else>
							<a href="/auth/login">Entrar</a>
						</template>
					</div>

				</div>
			</template>
		</the-app-header>

		<main class="w-full flex-1 overflow-hidden bg-white">
			<template v-if="isLoading">
				Carregando
			</template>
			<template v-else>
				<router-view
					v-slot="{ Component }">

					<transition
						@enter="fadeIn"
						@leave="fadeOut"
						mode="out-in"
						:css="false">
						<keep-alive include="AppHome">
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
			</template>


		</main>



		<lsm-toast-notification-container></lsm-toast-notification-container>
	</section>

</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from "vue";
import TheAppHeader from "./core/the-app-header.vue"
import fade from "../../../../_etc/shared_mixins/fade";

import LsmToastNotificationContainer
	from "../../../../_etc/shared_components/ui/notification/lsm-toast-notification-container";

export default defineComponent({
	"name": "LsmApp",
	"mixins": [
		fade
	],
	"data": function () {
		return {
			"isLoading": false
		}
	},
	"components": {
		LsmToastNotificationContainer,
		TheAppHeader
	},
	"computed": {
		"userInfo": function () {
			return this.$store.getters["utilities/userInfo"];
		},
		"cartItemsLength": function () {
			return this.$store.getters["shoppingCart/currentCart"].length;
		}
	},
	async beforeCreate () {
		this.isLoading = true;
		let result = await this.$store.dispatch("utilities/getUserInfo");
		if (result && result.id) {
			let [cartStatus] = await Promise.all([
				this.$store.dispatch("shoppingCart/retrieveCartItems"),
				this.$store.dispatch("orders/retrieveOwnedItems")
			]);
			if (!cartStatus) {
				await this.$store.dispatch("shoppingCart/createCart");
			}
		} else {
			if (this.$route.name !== "app.home") {
				return await this.$router.replace({
					"name": "app.home"
				});
			}
		}

		this.isLoading = false;

		await Promise.all([
			this.$store.dispatch("advancedFilters/loadBrothers"),
			this.$store.dispatch("advancedFilters/loadCategories"),
			this.$store.dispatch("advancedFilters/loadLocations")
		]);

	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

.header-link {
	overflow: hidden;
	text-overflow: ellipsis;
	&:hover {
		font-weight: 600;

	}
}
</style>

