<template>
  <header id="app-header">
    <h1>Application</h1>
  </header>
</template>
<script type="text/javascript">
"use strict";
import { defineComponent } from 'vue';
export default defineComponent({
	"name": "AppHeader"
});
</script>
<style scoped lang="scss" rel="stylesheet/scss">

@import "../../../css/variables.scss";

#app-header {
	grid-area: app-header;
	height: 48px;
	width: 100%;
	background-color: $primary-bg-color;
	color: $primary-text-color;
	font-family: $font-stack;
	display: flex;
	align-items: center;
	padding: 0 12px;

	h1 {
		margin: 0;
		font-size: 18px;
		letter-spacing: 1px;
		font-weight: 500;
		position: relative;
		top: 1.5px;
	}
}
</style>
