"use strict";

import gsap from "gsap";

export default {
	"methods": {
		fadeIn(el, done) {
			let tl = gsap.timeline({
				"repeat": 99,
				"repeatDelay": 0.4
			});
			//console.log(el.parentElement.getComputedStyle("width"));
			tl.fromTo(el, {
				"x": "-100%",
				"ease": "power4.out"
			}, {
				"x": function () {
					return el.parentElement.offsetWidth
				},
				"ease": "power0.in",
				"duration": 1.4,
				"onComplete": () => {
					done();
				}
			});
		},
		fadeOut(el, done) {
			gsap.to(el, {
				"autoAlpha": 0,
				"duration": 0.33,
				"onComplete": done
			});
		},
		fadeOutAbsolute(el, done) {
			gsap.to(el, {
				"autoAlpha": 0,
				"position": "absolute",
				"duration": 0.33,
				"onComplete": done
			});
		}
	}
}