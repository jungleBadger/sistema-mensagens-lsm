<template>
	<transition-group
		class="absolute top-0 right-0 z-50 pt-3 pr-3"
		tag="aside"
		:css="false"
		@before-enter="prepareNotification"
		@enter="showNotification"
		@leave="hideNotification">
		<lsm-toast-notification
			v-for="notification in notifications"
			:key="notification.id"
			:actionType="notification.actionType"
			:actionHandler="notification.actionHandler"
			:notification="notification" />
	</transition-group>

</template>
<script type="text/javascript">
"use strict";

import { defineComponent } from "vue";

import LsmToastNotification from "./lsm-toast-notification.vue";
import notificationAnimations from "../../../shared_mixins/notification";

export default defineComponent(
	{
		"name": "LsmToastNotificationContainer",
		"components": {
			LsmToastNotification
		},
		"mixins": [
			notificationAnimations
		],
		"computed": {
			"notifications": function () {
				return this.$store.getters["notification/getNotifications"];
			}
		}
	}
);
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>
