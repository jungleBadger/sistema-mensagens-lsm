<template>
	<aside class="h-1 w-full absolute bg-transparent left-0 z-20">
		<div
			style="margin-top: 0.050rem"
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
				"repeatDelay": 0.3,
				"repeat": -1,
				"repeatRefresh": true
			})
		}
	},
	mounted () {
		this.tl.fromTo(this.$refs.loadingIndicator, {
			"x": "-100%",
			"ease": "power4.out"
		}, {
			"x": () => {
				return this.$refs.loadingIndicator.parentElement.offsetWidth
			},
			"ease": "power1.in",
			"duration": 1.4
		});
	},
	unmounted () {
		this.tl.kill();
	}
}
</script>