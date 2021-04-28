"use strict";

import gsap from "gsap";

export default {
	"methods": {
		fadeIn(el, done) {
			gsap.set(el, {"autoAlpha": 0});
			gsap.to(el, {
				"autoAlpha": 1,
				"duration": 0.66,
				"onComplete": done
			});
		},
		fadeOut(el, done) {
			gsap.to(el, {
				"autoAlpha": 0,
				"duration": 0.5,
				"onComplete": done
			});
		},
		fadeOutAbsolute(el, done) {
			gsap.to(el, {
				"autoAlpha": 0,
				"position": "absolute",
				"duration": 0.5,
				"onComplete": done
			});
		}
	}
}