<template>
	<lsm-modal

		@close="goToRegularUsersHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Usuário {{ selectedRegularUser.id }}
				</template>
				<template v-else>
					Criar novo Usuário
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-full h-auto flex flex-col gap-2">
				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Nome de exibição (opcional)</label>

					<lsm-input
						v-model="displayName"
						autofocus
						placeholder="Digite nome de exibição"
						@keyup.enter="submitForm">

					</lsm-input>
				</div>

				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Email</label>

					<lsm-input
						v-model="email"
						placeholder="Digite o e-mail do usuário"
						type="email"
						@keyup.enter="submitForm">

					</lsm-input>
				</div>


				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Perfil de administrador</label>
					<lsm-checkbox
						:model-value="false"
						v-model="isAdmin"
						:label="isAdmin ? 'É administrador' : 'Não é administrador'"
					></lsm-checkbox>
				</div>
			</div>

		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-4">
				<lsm-button
					:disabled="isDeleteLoading"
					:is-loading="isLoading"
					class="w-24"
					icon-id="check"
					icon-style="fas"
					label="Salvar"
					role="button"
					@click="submitForm">
				</lsm-button>
			</div>

		</template>

	</lsm-modal>
</template>
<script type="text/javascript">

"use strict";
import { defineComponent } from "vue";

import LsmModal from "../../../../../../../_etc/shared_components/ui/lsm-modal.vue";
import LsmInput from "../../../../../../../_etc/shared_components/ui/lsm-input";
import LsmButton from "../../../../../../../_etc/shared_components/ui/lsm-button";
import LsmCheckbox from "../../../../../../../_etc/shared_components/ui/lsm-checkbox";

export default defineComponent({
	"name": "TheRegularUserDetails",
	"components": {
		LsmCheckbox,
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"email": "",
			"displayName": "",
			"isAdmin": false
		};
	},
	"computed": {
		selectedRegularUser () {
			return this.$store.getters["users/regular/selectedRegularUser"];
		},

		isDocumentExistent () {
			return this.selectedRegularUser && this.selectedRegularUser.id;
		}
	},
	"methods": {
		goToRegularUsersHome () {
			return this.$router.push({ "name": "app.users" });
		},

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("users/regular/updateRegularUser", {
					"id": this.selectedRegularUser.id,
					"displayName": this.displayName,
					"isAdmin": this.isAdmin
				});
			} else {
				await this.$store.dispatch("users/regular/createRegularUser", this.displayName);
				await Promise.all([
					this.$store.dispatch("users/regular/retrieveTotalRegularUsersCount"),
					this.$store.dispatch("users/regular/retrieveRegularUsers")
				]);
			}

			this.isLoading = false;
			return this.goToRegularUsersHome();
		},

		async deleteItem () {

			this.isDeleteLoading = true;

			await this.$store.dispatch("users/regular/deleteRegularUser", this.selectedRegularUser.id);

			this.isDeleteLoading = false;
			return this.goToRegularUsersHome();
		}
	},

	async created () {
		if (!this.selectedRegularUser && this.$route.params.userId !== "novo") {
			this.isLoading = true;
			this.$store.commit(
				"users/regular/selectedRegularUser",
				await this.$store.dispatch("users/regular/retrieveRegularUserById", this.$route.params.userId)
			);
			this.isLoading = false;
		}

		console.log(this.selectedRegularUser);

		if (this.selectedRegularUser) {
			this.email = this.selectedRegularUser.email;
			this.displayName = this.selectedRegularUser.displayName;
		}

	},

	unmounted () {
		this.$store.commit("users/regular/unsetSelectedRegularUser");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
