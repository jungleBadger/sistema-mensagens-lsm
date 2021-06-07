<template>
	<section
		aria-label="Home da aplicação"
		class="w-full h-full p-2 overflow-hidden flex flex-col relative gap-4">

		<header class="flex gap-4">
			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-2xl">Início</h3>
				<h4 class="text-l divide-y">
					Area administrativa do Sistema de mensagens LSM.
				</h4>
			</div>
		</header>


		<main class="flex flex-col gap-4 divide-y bg-white p-2 shadow rounded-sm">
			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'ball-pile']"></font-awesome-icon>
					Categorias
				</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.categories.details', 'params': {'categoryId': 'novo'}}">Adicionar categoria</router-link>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.categories'}">Gerenciar categorias</router-link>
			</div>

			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'earth-americas']"></font-awesome-icon>
					Localidades</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.locations.details', 'params': {'locationId': 'novo'}}">Adicionar localidade</router-link>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.locations'}">Gerenciar localidades</router-link>
			</div>


			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'user-tie']"></font-awesome-icon>
					Irmãos</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.brothers.details', 'params': {'brotherId': 'novo'}}">Adicionar irmão</router-link>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.brothers'}">Gerenciar irmãos</router-link>
			</div>

			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'podcast']"></font-awesome-icon>
					Eventos e mensagens</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.events.details', 'params': {'eventId': 'novo'}}">Adicionar evento e mensagens</router-link>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.events'}">Gerenciar eventos e mensagens</router-link>
			</div>

			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'user-group-crown']"></font-awesome-icon>
					Usuários</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.users'}">Gerenciar usuários</router-link>
			</div>

			<div class="flex flex-col gap-2 flex-1">
				<h3 class="text-xl text-gray-700 font-semibold">
					<font-awesome-icon :icon="['fas', 'box-archive']"></font-awesome-icon>
					Logs</h3>
				<router-link
					class="text-blue-700"
					:to="{'name': 'app.logs'}">Visualizar logs do sistema</router-link>
			</div>
		</main>



	</section>
</template>
<script type="text/javascript">


"use strict";
import { defineComponent } from "vue";
import LsmInput from "../../../../../_etc/shared_components/ui/lsm-input.vue";


export default defineComponent({
	"name": "TheAppHome",
	"components": {
		LsmInput
	},
	"data": function () {
		return {
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
