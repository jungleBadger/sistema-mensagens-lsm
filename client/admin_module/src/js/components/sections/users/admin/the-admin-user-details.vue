<template>
	<lsm-modal

		@close="goToAdminUsersHome">

		<template v-slot:modal-header>
			<h3 class="text-gray-800 text-lg font-semibold">
				<template v-if="isDocumentExistent">
					Editar Usuário administrador {{ selectedAdminUser.id }}
				</template>
				<template v-else>
					Criar novo Usuário administrador
				</template>
			</h3>
		</template>

		<template v-slot:modal-content>


			<div class="w-full h-auto flex flex-col gap-2">
				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Email</label>

					<lsm-input
						v-model="email"
						autofocus
						placeholder="Digite o e-mail do usuário"
						type="email"
						@keyup.enter="submitForm">

					</lsm-input>
				</div>

				<div class="w-80 flex flex-col gap-1 h-20">
					<label class="text-gray-700 ">Nome de exibição</label>

					<lsm-input
						v-model="displayName"
						placeholder="Digite nome de exibição"
						@keyup.enter="submitForm">

					</lsm-input>
				</div>
			</div>


		</template>

		<template v-slot:modal-footer>
			<div class="w-full h-9 flex items-center justify-end gap-4">
				<lsm-button
					v-if="isDocumentExistent"
					:disabled="isLoading"
					:is-loading="isDeleteLoading"
					class="w-24 bg-red-400"
					icon-id="trash"
					icon-style="fas"
					label="Deletar"
					role="button"
					kind="danger"
					@click="deleteItem">
				</lsm-button>
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

export default defineComponent({
	"name": "TheAdminUserDetails",
	"components": {
		LsmButton,
		LsmInput,
		LsmModal
	},
	"data": function () {
		return {
			"isLoading": false,
			"isDeleteLoading": false,
			"email": "",
			"displayName": ""
		};
	},
	"computed": {
		selectedAdminUser () {
			return this.$store.getters["users/admin/selectedAdminUser"];
		},

		isDocumentExistent () {
			return this.selectedAdminUser && this.selectedAdminUser.id;
		}
	},
	"methods": {
		goToAdminUsersHome () {
			return this.$router.push({ "name": "app.users" });
		},

		async submitForm () {
			this.isLoading = true;

			if (this.isDocumentExistent) {
				await this.$store.dispatch("users/admin/updateAdminUser", {
					"id": this.selectedAdminUser.id,
					"displayName": this.displayName
				});
			} else {
				await this.$store.dispatch("users/admin/createAdminUser", this.displayName);
				await Promise.all([
					this.$store.dispatch("users/admin/retrieveTotalAdminUsersCount"),
					this.$store.dispatch("users/admin/retrieveAdminUsers")
				]);
			}

			this.isLoading = false;
			return this.goToAdminUsersHome();
		},

		async deleteItem () {

			this.isDeleteLoading = true;

			await this.$store.dispatch("users/admin/deleteAdminUser", this.selectedAdminUser.id);

			this.isDeleteLoading = false;
			return this.goToAdminUsersHome();
		}
	},

	async created () {
		if (!this.selectedAdminUser && this.$route.params.adminUserId !== "novo") {
			this.isLoading = true;
			this.$store.commit(
				"users/admin/selectedAdminUser",
				await this.$store.dispatch("users/admin/retrieveAdminUserById", this.$route.params.adminUserId)
			);
			this.isLoading = false;
		}

		console.log(this.selectedAdminUser);

		if (this.selectedAdminUser) {
			this.email = this.selectedAdminUser.email;
			this.displayName = this.selectedAdminUser.displayName;
		}

	},

	unmounted () {
		this.$store.commit("users/admin/unsetSelectedAdminUser");
	}
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
