<template>
	<view class="appointments-page">
		<!-- 头部 -->
		<view class="header">
			<text class="header-title">{{ $t('appointments.title') }}</text>
			<view class="tabs">
				<view 
					class="tab-item"
					:class="{ active: activeTab === 'upcoming' }"
					@click="switchTab('upcoming')"
				>
					{{ $t('appointments.upcoming') }}
				</view>
				<view 
					class="tab-item"
					:class="{ active: activeTab === 'completed' }"
					@click="switchTab('completed')"
				>
					{{ $t('appointments.completed') }}
				</view>
			</view>
		</view>

		<!-- 预约列表 -->
		<view class="appointment-list">
			<view 
				v-for="appointment in appointments" 
				:key="appointment._id"
				class="appointment-card"
			>
				<view class="appointment-header">
					<view class="mentor-info">
						<image class="mentor-avatar" :src="appointment.mentor?.avatar" mode="aspectFill"></image>
						<view class="mentor-details">
							<text class="mentor-name">{{ appointment.mentor?.name }}</text>
							<text class="mentor-specialty">{{ appointment.mentor?.specialties?.[0] || 'UI/UX 专家' }}</text>
						</view>
					</view>
					<view class="status-badge" :class="appointment.status">
						{{ getStatusText(appointment.status) }}
					</view>
				</view>
				<view class="appointment-content">
					<text class="course-name">{{ appointment.course_name || '作品集指导' }}</text>
					<view class="appointment-time">
						<text>{{ appointment.appointment_date }}</text>
						<text>{{ appointment.appointment_time }}</text>
					</view>
				</view>
				<view class="appointment-footer" v-if="appointment.status === 'confirmed'">
					<button class="enter-btn" @click="enterClassroom(appointment)">
						<uni-icons type="videocam" size="16" color="#ffffff"></uni-icons>
						{{ $t('appointments.enterClassroom') }}
					</button>
				</view>
			</view>

			<view v-if="loading" class="loading">
				<text>{{ $t('common.loading') }}</text>
			</view>

			<view v-if="!loading && appointments.length === 0" class="empty">
				<text>{{ $t('common.noData') }}</text>
			</view>
		</view>

		<!-- 底部导航 -->
		<BottomNav />
	</view>
</template>

<script>
	import BottomNav from '@/components/BottomNav/BottomNav.vue'
	
	export default {
		components: {
			BottomNav
		},
		data() {
			return {
				activeTab: 'upcoming',
				appointments: [],
				loading: false
			}
		},
		onLoad() {
			this.loadAppointments()
		},
		onShow() {
			this.loadAppointments()
		},
		methods: {
			async loadAppointments() {
				this.loading = true
				try {
					// 检查登录状态
					const token = uni.getStorageSync('uni_id_token')
					const userInfo = uni.getStorageSync('userInfo')
					
					console.log('预约页面 - token:', token ? '存在' : '不存在')
					console.log('预约页面 - userInfo:', userInfo)
					
					if (!token || !userInfo || !userInfo._id) {
						console.warn('预约页面 - 用户未登录，显示空列表')
						this.appointments = []
						this.loading = false
						return
					}
					
					const status = this.activeTab === 'upcoming' ? 'confirmed' : 'completed'
					
					// 使用云对象获取订单列表
					// uniCloud 会自动从本地存储中读取 uni_id_token 并传递给云对象
					const ordersObj = uniCloud.importObject('orders')
					const res = await ordersObj.getList({
						role: 'student',
						status: status,
						user_id: userInfo._id // 备用方案：如果 token 无法获取，使用用户ID
					})
					
					console.log('预约页面 - 订单列表响应:', res)
					
					if (res.code === 0) {
						this.appointments = res.data || []
					} else {
						// 如果是未登录错误，不显示 toast，只显示空列表
						if (res.message && res.message.includes('未登录')) {
							console.warn('预约页面 - 云对象返回未登录')
							this.appointments = []
						} else {
							uni.showToast({
								title: res.message || '加载失败',
								icon: 'none'
							})
						}
					}
				} catch (error) {
					console.error('加载订单失败:', error)
					
					// 处理用户未登录的情况
					if (error.message && error.message.includes('未登录')) {
						console.warn('预约页面 - 捕获到未登录错误')
						this.appointments = []
					} else {
						uni.showToast({
							title: error.message || '加载失败',
							icon: 'none'
						})
					}
				} finally {
					this.loading = false
				}
			},
			switchTab(tab) {
				this.activeTab = tab
				this.loadAppointments()
			},
			getStatusText(status) {
				const statusMap = {
					pending: '待确认',
					confirmed: '即将开始',
					completed: '已完成',
					cancelled: '已取消'
				}
				return statusMap[status] || status
			},
			enterClassroom(appointment) {
				if (appointment.zoom_join_url) {
					// 在小程序中打开外部链接
					uni.showModal({
						title: '提示',
						content: '请使用邮件中的 Zoom 链接进入课堂',
						showCancel: false
					})
				} else {
					uni.showToast({
						title: '会议链接未生成',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped>
	.appointments-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 120rpx;
	}

	.header {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e5e5e5;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		padding: 24rpx 32rpx;
	}

	.tabs {
		display: flex;
		padding: 0 32rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 24rpx 0;
		font-size: 28rpx;
		color: #999;
		font-weight: 500;
		position: relative;
	}

	.tab-item.active {
		color: #00B4D8;
		font-weight: 600;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4rpx;
		background-color: #00B4D8;
	}

	.appointment-list {
		padding: 32rpx;
	}

	.appointment-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.appointment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.mentor-info {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.mentor-avatar {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
	}

	.mentor-details {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.mentor-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.mentor-specialty {
		font-size: 24rpx;
		color: #999;
	}

	.status-badge {
		padding: 8rpx 20rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		font-weight: bold;
		text-transform: uppercase;
	}

	.status-badge.confirmed {
		background-color: rgba(0, 180, 216, 0.1);
		color: #00B4D8;
	}

	.status-badge.completed {
		background-color: rgba(76, 175, 80, 0.1);
		color: #4CAF50;
	}

	.appointment-content {
		background-color: #f5f6f8;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
	}

	.course-name {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 16rpx;
	}

	.appointment-time {
		display: flex;
		gap: 32rpx;
		font-size: 24rpx;
		color: #666;
	}

	.appointment-footer {
		display: flex;
		justify-content: flex-end;
	}

	.enter-btn {
		background-color: #14b8a6;
		color: #ffffff;
		border: none;
		border-radius: 16rpx;
		padding: 16rpx 32rpx;
		font-size: 24rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.loading, .empty {
		text-align: center;
		padding: 64rpx;
		color: #999;
		font-size: 28rpx;
	}

</style>
