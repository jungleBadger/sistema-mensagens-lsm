"use strict";

import gsap from "gsap/dist/gsap";
export default {
	"methods": {
		"prepareNotification": function (el) {
			gsap.set(el, {
				"autoAlpha": 0,
				"y": -100
			});
		},
		"showNotification": function (el, done = () => false, duration = 0.3, delay = 0) {
			gsap.to(el, {
				"autoAlpha": 1,
				"ease": "sine.out",
				"duration": duration,
				"delay": delay,
				"onComplete": done,
				"y": 0
			});
		},
		"hideNotification": function (el, done, duration = 0.3, delay = 0) {
			gsap.to(el,{
				"autoAlpha": 0,
				"ease": "sine.in",
				"height": 0,
				"duration": duration,
				"delay": delay,
				"onComplete": done
			});
		}
	}
}