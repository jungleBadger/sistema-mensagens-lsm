<template>

	<div class="min-width: 300px; min-height: 90px;">

		<transition
			@leave="fadeOutAbsolute"
			:css="false">
			<div
				v-if="isLoading"
				class="skeleton-box left-0 right-0 max-w-full"
				style="height: 74px; width: 300px; margin: 0 auto;">
			</div>

			<div
				style="min-height: 80px;"
				v-else>
				<transition
					@enter="fadeIn"
					@leave="fadeOut"
					mode="out-in"
					:css="false">
					<form
						v-if="shouldDisplayCaptcha"
						class="flex justify-center"
						:key="'form'"
						action="?"
						method="POST"
						@submit.prevent="submitValidationForm">
						<div
							ref="test"
							class="g-recaptcha">
						</div>
						<input
							aria-hidden="true"
							class="sr-only"
							type="submit"
							value="Submit">
					</form>

					<slot v-else></slot>
				</transition>
			</div>
		</transition>




	</div>

</template>
<script type="text/javascript">
"use strict";

import { defineComponent } from "vue";
import fade from "../../../../_etc/shared_mixins/fade";

export default defineComponent({
	"name": "RecaptchaProtectedResource",
	"mixins": [
		fade
	],
	"data": function () {
		return {
			"isLoading": true
		}
	},
	"computed": {
		"gCaptchaLatestTs": function() {
			return this.$store.getters["auth/gCaptchaLatestTs"] || "";
		},

		"shouldDisplayCaptcha": function () {
			const TWO_MINUTES = 1000 * 60 * 2;
			let storedTs = this.gCaptchaLatestTs ? new Date(this.gCaptchaLatestTs).getTime() : false;
			return storedTs ? ((Date.now() - storedTs) > TWO_MINUTES) : true;
		}
	},
	"methods": {

		async submitValidationForm(recaptchaData) {
			await this.$store.dispatch("auth/verifyCaptcha", recaptchaData);
		}

	},

	mounted() {
		if (this.shouldDisplayCaptcha) {
			let listener = setInterval(() => {
				if (window.grecaptcha) {
					this.isLoading = false;
					window.grecaptcha.ready(() => {
						window.grecaptcha.render(this.$refs.test, {
							//@TODO Inject the correct key through dotenv
							// "sitekey" : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
							"sitekey" : "6LcmU9AaAAAAAK_0Vtnwg0HnS_-cz1L2beFykMSS\n",
							"hl": "pt",
							"callback": this.submitValidationForm
						});
					});
					return clearInterval(listener);
				}
			}, 1000);
		} else {
			this.isLoading = false;
		}
	}
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
