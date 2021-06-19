<template>

	<section class="flex flex-col flex-1 w-full h-full">
		<the-app-header class="md:pl-12 md:pr-12 pl-0 md:pl-2 md:pr-2">

			<template v-slot:app-buttons>
				<button
					aria-controls="lsm-sidemenu"
					class="bg-white text-gray-800 hover:bg-gray-200 hover:text-gray-900 active:bg-gray-400 transition-colors w-12 h-12 flex md:hidden items-center justify-center"
					@click="toggleOverflowMenu">
					<template v-if="isOverflowMenuOpen">
					<span
						aria-label="Fechar menu de navegação"
						role="img">
						<font-awesome-icon :icon="['fal', 'xmark']"/>
					</span>
					</template>
					<template v-else>
					<span
						aria-label="Abrir menu de navegação"
						role="img">
						<font-awesome-icon :icon="['fal', 'bars']"/>
					</span>
					</template>
				</button>
				<transition :css="false"
							mode="out-in"
							@enter="fadeIn"
							@leave="fadeOut">
					<aside
						v-if="isOverflowMenuOpen"
						class="w-48 h-auto bg-white rounded-b shadow-lg border absolute left-0 flex flex-col gap-2"
						style="top: 48px; z-index: -1;">

						<router-link
							:to="{'name': 'app.home'}"
							class="p-2 hover:bg-gray-200 transition-colors flex items-center gap-4"
							@click="closeOverflowMenu">
							<font-awesome-icon
								:icon="['fas', 'house']"/>
							Inicio
						</router-link>

						<template v-if="userInfo && userInfo.id">
							<router-link
								:to="{'name': 'app.owned'}"
								class="p-2 hover:bg-gray-200 transition-colors flex items-center gap-4"
								@click="closeOverflowMenu">
								<font-awesome-icon :icon="['fas', 'user-music']"/>
								Minhas mensagens
							</router-link>

							<router-link
								:to="{'name': 'app.owned'}"
								class="p-2 hover:bg-gray-200 transition-colors flex items-center gap-4"
								@click="closeOverflowMenu">
								<font-awesome-icon :icon="['fas', 'user-gear']"/>
								Perfil
							</router-link>

							<router-link
								:to="{'name': 'app.checkout'}"
								class="p-2 hover:bg-gray-200 transition-colors flex items-center gap-4"
								@click="closeOverflowMenu">
								<font-awesome-icon :icon="['fas', 'cart-shopping']"/>
								Carrinho ({{ cartItemsLength }})
							</router-link>


							<a
								class="p-2 hover:bg-gray-200 text-red-700 transition-colors flex items-center gap-4"
								href="/auth/logout"
								@click="closeOverflowMenu">
								<font-awesome-icon :icon="['fas', 'arrow-up-left-from-circle']"/>
								Sair
							</a>

						</template>

						<template v-else>
							<router-link
								:to="{'name': 'app.owned'}"
								class="p-2 hover:bg-gray-200 transition-colors flex items-center gap-4"
								@click="closeOverflowMenu">
								<font-awesome-icon :icon="['fas', 'user']"/>
								Entrar ou criar conta
							</router-link>

						</template>


					</aside>
				</transition>


				<div class="flex gap-4 w-full ">
					<div class="pl-2 hidden md:block">
						<router-link
							:to="{'name': 'app.home'}">
							<img
								alt="Logotipo Livro aberto"
								class="mx-auto h-10 w-auto"
								role="img"
								src="/_etc/assets/1x/logo.png"
							/>
						</router-link>
					</div>


					<div
						class="pr-2 flex flex-1 gap-12 items-center justify-end overflow-hidden overflow-ellipsis whitespace-nowrap hidden md:flex">
						<template v-if="userInfo && userInfo.id">

							<router-link
								:to="{'name': 'app.owned'}"
								class="header-link text-gray-600">
								<font-awesome-icon :icon="['fas', 'user-music']"/>
								Minhas mensagens
							</router-link>

							<router-link
								:to="{'name': 'app.owned'}"
								class="header-link text-gray-600">
								<font-awesome-icon :icon="['fas', 'user-gear']"/>
								Perfil
							</router-link>

							<router-link
								:to="{'name': 'app.checkout'}"
								class="header-link text-gray-600">
								<font-awesome-icon :icon="['fas', 'cart-shopping']"/>
								Carrinho ({{ cartItemsLength }})
							</router-link>

							<a
								class="header-link text-gray-600"
								href="/auth/logout">
								<font-awesome-icon :icon="['fas', 'arrow-up-left-from-circle']"/>
								Sair
							</a>
						</template>

						<template v-else>
							<a
								class="header-link text-gray-600"
								href="/auth/login">
								<font-awesome-icon :icon="['fas', 'user']"/>
								Entrar ou criar conta
							</a>
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
						:css="false"
						mode="out-in"
						@enter="fadeIn"
						@leave="fadeOut">
						<component :is="Component"/>
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
import TheAppHeader from "./core/the-app-header.vue";
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
			"isLoading": false,
			"isOverflowMenuOpen": false
		};
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
	"methods": {
		toggleOverflowMenu () {
			this.isOverflowMenuOpen = !this.isOverflowMenuOpen;
		},
		closeOverflowMenu () {
			this.$nextTick(() => {
				this.isOverflowMenuOpen = false;
			});
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
<style lang="scss" rel="stylesheet/scss" scoped>

.header-link {
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	grid-gap: 8px;
	align-items: center;

	&:hover {
		font-weight: 600;

	}
}
</style>

