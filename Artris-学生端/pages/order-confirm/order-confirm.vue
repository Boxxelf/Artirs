<template>
	<view class="order-confirm-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('booking.confirmOrder') }}</text>
			<view class="nav-placeholder"></view>
		</view>

		<view class="content">
			<!-- 导师信息卡片 -->
			<view class="mentor-card">
				<view class="mentor-info">
					<image class="mentor-avatar" :src="mentor.avatar" mode="aspectFill"></image>
					<view class="mentor-details">
						<text class="mentor-name">{{ mentor.name }}</text>
						<text class="course-name">{{ $t('booking.portfolioGuidance') }}</text>
						<text class="appointment-time">{{ appointmentDate }} {{ appointmentTime }}</text>
					</view>
				</view>
			</view>

			<!-- 费用明细 -->
			<view class="price-card">
				<view class="price-row">
					<text class="price-label">{{ $t('booking.courseFee') }}</text>
					<text class="price-value">¥{{ orderPrice.toFixed(2) }}</text>
				</view>
				<view class="price-row discount">
					<text class="price-label">{{ $t('booking.coupon') }}</text>
					<text class="price-value discount-value">-¥{{ discount.toFixed(2) }}</text>
				</view>
				<view class="divider"></view>
				<view class="price-row total">
					<text class="price-label">{{ $t('booking.totalAmount') }}</text>
					<text class="price-value total-value">¥{{ totalAmount.toFixed(2) }}</text>
				</view>
			</view>
		</view>

		<!-- 底部支付栏 -->
		<view class="footer-bar">
			<view class="total-info">
				<text class="total-label">{{ $t('booking.totalAmount') }}</text>
				<text class="total-price">¥{{ totalAmount.toFixed(2) }}</text>
			</view>
			<button class="pay-btn" @click="handlePay">
				{{ $t('booking.payNow') }}
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mentorId: '',
				appointmentDate: '',
				appointmentTime: '',
				mentor: {},
				orderPrice: 380,
				discount: 20,
				totalAmount: 360
			}
		},
		onLoad(options) {
			if (options.mentorId) {
				this.mentorId = options.mentorId
			}
			if (options.date) {
				this.appointmentDate = options.date
			}
			if (options.time) {
				this.appointmentTime = options.time
			}
			this.loadMentorInfo()
		},
		methods: {
			async loadMentorInfo() {
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
						this.orderPrice = this.mentor.price || 380
						this.totalAmount = this.orderPrice - this.discount
					}
				} catch (error) {
					console.error('加载导师信息失败:', error)
				}
			},
			goBack() {
				uni.navigateBack()
			},
			async handlePay() {
				// 检查登录状态
				const userInfo = uni.getStorageSync('userInfo')
				const uniIdToken = uni.getStorageSync('uni_id_token')
				
				if (!userInfo || !userInfo._id || !uniIdToken) {
					uni.showModal({
						title: '提示',
						content: '请先登录后再创建订单',
						confirmText: '去登录',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
					return
				}
				
				try {
					// 使用云对象创建订单
					const ordersObj = uniCloud.importObject('orders')
					
					const createRes = await ordersObj.create({
						mentor_id: this.mentorId,
						appointment_date: this.appointmentDate,
						appointment_time: this.appointmentTime,
						duration: 60,
						course_name: '作品集指导',
						price: this.orderPrice,
						discount: this.discount,
						total_amount: this.totalAmount,
						user_id: userInfo._id // 备用方案：如果 token 无法获取，使用用户ID
					})
					
					if (createRes.code === 0) {
						uni.navigateTo({
							url: `/pages/success/success?orderId=${createRes.data.order_id}&orderNo=${createRes.data.order_no}&mentorName=${this.mentor.name}`
						})
					} else {
						uni.showToast({
							title: createRes.message || '创建订单失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('创建订单失败:', error)
					
					// 处理用户未登录的情况
					if (error.message && error.message.includes('未登录')) {
						uni.showModal({
							title: '提示',
							content: '请先登录后再创建订单',
							showCancel: false
						})
					} else {
						uni.showToast({
							title: error.message || '创建订单失败',
							icon: 'none'
						})
					}
				}
			}
		}
	}
</script>

<style scoped>
	.order-confirm-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 160rpx;
	}

	.navbar {
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 32rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e5e5e5;
		z-index: 100;
	}

	.nav-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.nav-placeholder {
		width: 48rpx;
	}

	.content {
		padding: 32rpx;
	}

	.mentor-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 24rpx;
		padding: 40rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.mentor-info {
		display: flex;
		gap: 32rpx;
	}

	.mentor-avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.mentor-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.mentor-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.course-name {
		font-size: 28rpx;
		color: #666;
	}

	.appointment-time {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.price-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.price-label {
		font-size: 28rpx;
		color: #666;
	}

	.price-value {
		font-size: 28rpx;
		color: #333;
	}

	.price-row.discount .price-value {
		color: #ff6b6b;
	}

	.divider {
		height: 1px;
		background-color: #e5e5e5;
		margin: 24rpx 0;
	}

	.price-row.total {
		margin-bottom: 0;
	}

	.total-value {
		font-size: 40rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(12px);
		border-top: 1px solid #e5e5e5;
		padding: 32rpx;
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 100;
	}

	.total-info {
		display: flex;
		flex-direction: column;
	}

	.total-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.total-price {
		font-size: 48rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.pay-btn {
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 50rpx;
		padding: 28rpx 80rpx;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}
</style>
