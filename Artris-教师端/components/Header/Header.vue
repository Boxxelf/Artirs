<template>
	<view class="header">
		<view class="header-left">
			<view v-if="showBack" class="back-btn" @click="goBack">
				<uni-icons type="left" size="24" color="#666"></uni-icons>
			</view>
			<view v-else class="logo-container">
				<image class="logo" src="/static/ArtrisTeacher.png" mode="aspectFit"></image>
			</view>
		</view>
		<text class="header-title">{{ title }}</text>
		<view class="header-right">
			<slot name="right">
				<view class="icon-btn" @click="handleRightClick">
					<uni-icons :type="rightIcon" size="24" color="#666"></uni-icons>
					<view v-if="rightIcon === 'bell' && showBadge" class="badge"></view>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Header',
		props: {
			title: {
				type: String,
				default: 'Artris'
			},
			showBack: {
				type: Boolean,
				default: false
			},
			rightIcon: {
				type: String,
				default: 'bell'
			},
			showBadge: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			handleRightClick() {
				this.$emit('rightClick')
			}
		}
	}
</script>

<style scoped>
	.header {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 32rpx;
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		z-index: 100;
	}
	
	.header-left {
		min-width: 80rpx;
		display: flex;
		align-items: center;
	}
	
	.back-btn {
		padding: 8rpx;
	}
	
	.logo-container {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 107, 53, 0.1);
		border-radius: 50%;
	}
	
	.logo {
		width: 60rpx;
		height: 60rpx;
	}
	
	.header-title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.header-right {
		min-width: 80rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
	.icon-btn {
		position: relative;
		padding: 8rpx;
	}
	
	.badge {
		position: absolute;
		top: 4rpx;
		right: 4rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #ff4757;
		border-radius: 50%;
		border: 2px solid #fff;
	}
</style>
