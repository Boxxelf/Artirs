<template>
	<view class="glass-card" :class="customClass" :style="customStyle">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'GlassCard',
		props: {
			customClass: {
				type: String,
				default: ''
			},
			customStyle: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style scoped>
	.glass-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 24rpx;
	}
</style>
