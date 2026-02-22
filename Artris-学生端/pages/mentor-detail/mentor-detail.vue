<template>
	<view class="mentor-detail-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('mentor.detail') }}</text>
			<uni-icons type="list" size="24" color="#333"></uni-icons>
		</view>

		<!-- 头部信息 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<image class="mentor-avatar" :src="mentor.avatar" mode="aspectFill"></image>
				<view class="mentor-basic">
					<text class="mentor-name">{{ mentor.name }}</text>
					<text class="mentor-degree">{{ mentor.school }} · {{ mentor.degree }}</text>
				</view>
				<view class="action-buttons">
					<button class="follow-btn">{{ $t('mentor.follow') }}</button>
					<button class="message-btn" @click="goToChat">{{ $t('mentor.message') }}</button>
				</view>
			</view>
		</view>

		<!-- 导师简介 -->
		<view class="intro-section">
			<text class="section-title">{{ $t('mentor.intro') }}</text>
			<text class="intro-text">{{ mentor.intro || '暂无简介' }}</text>
		</view>

		<!-- 底部操作栏 -->
		<view class="footer-bar">
			<view class="price-info">
				<text class="price-label">{{ $t('mentor.startingFrom') }}</text>
				<view class="price">
					<text class="price-value">¥{{ mentor.price }}</text>
					<text class="price-unit">/{{ $t('mentor.pricePerSession') }}</text>
				</view>
			</view>
			<button class="book-btn" @click="goToBooking">
				{{ $t('mentor.bookNow') }}
				<uni-icons type="calendar" size="18" color="#ffffff"></uni-icons>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mentorId: '',
				mentor: {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.mentorId = options.id
				this.loadMentorDetail()
			}
		},
		methods: {
			async loadMentorDetail() {
				try {
					const res = await uniCloud.callFunction({
						name: 'mentors',
						data: {
							action: 'getDetail',
							data: {
								mentorId: this.mentorId
							}
						}
					})
					
					if (res.result.code === 0) {
						this.mentor = res.result.data
					} else {
						uni.showToast({
							title: res.result.message || '加载失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('加载导师详情失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				}
			},
			goBack() {
				uni.navigateBack()
			},
			goToChat() {
				uni.navigateTo({
					url: `/pages/chat/chat?mentorId=${this.mentorId}`
				})
			},
			goToBooking() {
				uni.navigateTo({
					url: `/pages/booking/booking?mentorId=${this.mentorId}`
				})
			}
		}
	}
</script>

<style scoped>
	.mentor-detail-page {
		min-height: 100vh;
		background-color: #ffffff;
		padding-bottom: 160rpx;
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 32rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		z-index: 100;
	}

	.nav-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		text-transform: uppercase;
		letter-spacing: 2rpx;
	}

	.header-section {
		position: relative;
		margin-top: 88rpx;
	}

	.header-bg {
		height: 384rpx;
		background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%);
		opacity: 0.9;
	}

	.header-content {
		position: relative;
		margin-top: -64rpx;
		padding: 0 48rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.mentor-avatar {
		width: 256rpx;
		height: 256rpx;
		border-radius: 50%;
		border: 8rpx solid #ffffff;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
		background-color: #ffffff;
	}

	.mentor-basic {
		text-align: center;
		margin-top: 32rpx;
	}

	.mentor-name {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.mentor-degree {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #00B4D8;
	}

	.action-buttons {
		display: flex;
		gap: 24rpx;
		margin-top: 48rpx;
		width: 100%;
		max-width: 600rpx;
	}

	.follow-btn {
		flex: 1;
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 24rpx;
		font-size: 28rpx;
		font-weight: bold;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}

	.message-btn {
		flex: 1;
		background-color: #ffffff;
		color: #333;
		border: 1px solid #e5e5e5;
		border-radius: 24rpx;
		padding: 24rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.intro-section {
		padding: 80rpx 48rpx;
	}

	.section-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 24rpx;
	}

	.intro-text {
		display: block;
		font-size: 30rpx;
		color: #666;
		line-height: 1.8;
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(12px);
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		padding: 32rpx;
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 100;
	}

	.price-info {
		display: flex;
		flex-direction: column;
	}

	.price-label {
		font-size: 24rpx;
		font-weight: 500;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 2rpx;
		margin-bottom: 8rpx;
	}

	.price {
		display: flex;
		align-items: baseline;
	}

	.price-value {
		font-size: 48rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.price-unit {
		font-size: 28rpx;
		color: #999;
		margin-left: 8rpx;
	}

	.book-btn {
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 24rpx 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}
</style>
