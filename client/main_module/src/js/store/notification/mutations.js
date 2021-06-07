"use strict";

import AppNotification from "./model/AppNotification";

export default {
	"addNotification": function (context, notification) {
		context.notifications.push(new AppNotification(notification));
	},

	"dismissNotification": function (context, notificationId) {
		context.notifications = context.notifications.filter(notification => notification.id !== notificationId);
	}
};