"use strict";

import { createApp } from "vue";

import MainComponent from "./components/app.vue";
import routerHandler from "./router/index.js";
import storeHandler from "./store/index.js";
import i18nHandler from "./i18n/index.js";
import FontAwesomeIcon from "../../../_etc/js/fontawesome-import";
import cookieConsentTools from "cookie-consent-tools";

setTimeout(() => {
	cookieConsentTools.initialize( {
		cookieName: "cct_choice",
		cookieAttributes: {
			path: "/",
			expires: 365,
			secure: false,
			sameSite: "strict"
		},
		onConsentLoaded: undefined,
		onConsentUpdated: undefined,
		consentBox: {
			autoDisplay: true,
			container: "lsm-app",
			type: "message", // or 'choice'
			messages: {
				message: "Esse site utiliza cookies para uma melhor experiência; Um identificador único é usado para manter sua sessão.",
				seeMoreLabel: "Ver mais...",
				okButton: "Entendi",
				approveButton: "Allow Cookies",
				declineButton: "Decline"
			},
			seeMoreLink: {
				href: null,
				target: "_self"
			},
			onOkButtonClick: undefined,
			onApproveButtonClick: undefined,
			onDeclineButtonClick: undefined,
			onShow: undefined,
			onHide: undefined
		}
	});
}, 1000);

export default createApp(
	MainComponent
).use(
	routerHandler
).use(
	storeHandler
).use(
	i18nHandler
).component("FontAwesomeIcon", FontAwesomeIcon).mount("#lsm-app");


