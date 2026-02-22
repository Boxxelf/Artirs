<template>
	<view class="success-page">
		<view class="success-content">
			<view class="success-icon">
				<view class="checkmark-icon">✓</view>
			</view>
			<text class="success-title">{{ $t('success.title') }}</text>
			<text class="success-message">{{ $t('success.message', { mentor: mentorName }) }}</text>
			<view class="action-buttons">
				<button class="view-btn" @click="goToAppointments">
					{{ $t('success.viewAppointments') }}
				</button>
				<button class="home-btn" @click="goToHome">
					{{ $t('success.backHome') }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderNo: '',
				appointmentId: '', // 兼容旧参数
				mentorName: ''
			}
		},
		onLoad(options) {
			// 支持新的订单参数
			if (options.orderId) {
				this.orderId = options.orderId
			}
			if (options.orderNo) {
				this.orderNo = options.orderNo
			}
			// 兼容旧的预约参数
			if (options.appointmentId) {
				this.appointmentId = options.appointmentId
				this.orderId = options.appointmentId // 兼容处理
			}
			if (options.mentorName) {
				this.mentorName = decodeURIComponent(options.mentorName)
			}
		},
		methods: {
			goToAppointments() {
				uni.redirectTo({
					url: '/pages/appointments/appointments'
				})
			},
			goToHome() {
				uni.redirectTo({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style scoped>
	.success-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48rpx;
	}

	.success-content {
		width: 100%;
		max-width: 600rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.success-icon {
		width: 192rpx;
		height: 192rpx;
		border-radius: 50%;
		background-color: rgba(0, 191, 165, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 48rpx;
	}

	.checkmark-icon {
		font-size: 120rpx;
		color: #00bfa5;
		font-weight: bold;
		line-height: 1;
	}

	.success-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 16rpx;
	}

	.success-message {
		font-size: 28rpx;
		color: #999;
		line-height: 1.6;
		margin-bottom: 80rpx;
		padding: 0 32rpx;
	}

	.action-buttons {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.view-btn {
		width: 100%;
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 16rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}

	.home-btn {
		width: 100%;
		background-color: transparent;
		color: #999;
		border: none;
		border-radius: 16rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: 500;
	}
</style>
