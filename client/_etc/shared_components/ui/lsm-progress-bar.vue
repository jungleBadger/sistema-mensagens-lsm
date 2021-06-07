<template>
	<aside class="h-1 w-full absolute bg-transparent left-0 top-0 z-20">
		<div
			ref="loadingIndicator"
			class="h-full shadow-sm w-12 bg-blue-500">
		</div>
	</aside>
</template>
<script>

import gsap from "gsap";
export default {
	"name": "LsmProgressBar",
	setup () {
		return {
			"tl": gsap.timeline({
				"repeatDelay": 0,
				"repeat": -1,
				"repeatRefresh": true
			})
		}
	},
	mounted () {

		this.tl.set(
			this.$refs.loadingIndicator,
			{
				"autoAlpha": 0
			}
		);
		this.tl.fromTo(this.$refs.loadingIndicator, {
			"x": "-5%",
		}, {
			"x": () => {
				return this.$refs.loadingIndicator.parentElement.offsetWidth
			},
			"ease": "power4.inOut",
			"duration": 1.4
		});

		this.tl.to(this.$refs.loadingIndicator, {
			"autoAlpha": 1,
			"duration": 0.5,
			"repeat": 1,
			"yoyo": true
		}, 0);

	},
	unmounted () {
		this.tl.kill();
	}
}
</script>