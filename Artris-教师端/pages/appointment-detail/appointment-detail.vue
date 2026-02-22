<template>
	<view class="appointment-detail-page">
		<Header :title="$t('appointment.title')" :showBack="true"></Header>
		
		<view class="content">
			<!-- 学生信息 -->
			<view class="info-section glass-card">
				<text class="section-title">{{ $t('appointment.studentInfo') }}</text>
				<view class="student-card">
					<image class="student-avatar" :src="appointment.studentAvatar" mode="aspectFill"></image>
					<view class="student-info">
						<text class="student-name">{{ appointment.studentName }}</text>
						<text class="student-email">{{ appointment.studentEmail }}</text>
					</view>
				</view>
			</view>
			
			<!-- 课程信息 -->
			<view class="info-section glass-card">
				<text class="section-title">{{ $t('appointment.courseInfo') }}</text>
				<view class="info-list">
					<view class="info-item">
						<text class="info-label">{{ $t('appointment.courseType') }}</text>
						<text class="info-value">{{ appointment.courseType }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">{{ $t('appointment.appointmentTime') }}</text>
						<text class="info-value">{{ appointment.date }} {{ appointment.time }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">{{ $t('common.duration') }}</text>
						<text class="info-value">{{ appointment.duration }} {{ $t('common.hour') }}</text>
					</view>
				</view>
			</view>
			
			<!-- 操作按钮 -->
			<view class="actions-section">
				<button 
					class="action-btn reject-btn" 
					@click="handleReject"
					:disabled="loading"
				>
					{{ $t('appointment.rejectAppointment') }}
				</button>
				<button 
					class="action-btn confirm-btn primary-bg" 
					@click="handleConfirm"
					:disabled="loading"
				>
					<text v-if="loading">{{ $t('appointment.confirming') }}</text>
					<text v-else>{{ $t('appointment.confirmAppointment') }}</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n.js'
	import Header from '@/components/Header/Header.vue'
	
	export default {
		components: {
			Header
		},
		data() {
			return {
				loading: false,
				appointmentId: '',
				appointment: {
					studentName: 'Li Hua (李华)',
					studentEmail: 'lihua@example.com',
					studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBknlES0wQDeF2sr5hQS532ikgkjc5rAdu4n2QvnsOCctcHAzab1khpHYKHFRvgTtk6sXfNUlUdoY1fyFVsZT5vIGK0Zoqd9wApg47d4BPRxvSog4ehB0oYQqtJ5BroNhXHVl1BABK1ZAEGJeQ_Qq5wwAWPeSr41Uq4M1qwf86TD7ltzqq6IenwC3wyMGxq8uwtQuR6UnZkj_9C3yRYN0Ty7sYKESFZJqw1E9A4No6pY0AfZkACOjhTPfjm0mGgOv-B2-D8zhgrJWsn',
					courseType: '作品集指导 (Portfolio Guidance)',
					date: '2023-10-12',
					time: '14:00 - 15:00',
					duration: 1
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.appointmentId = options.id
				// 加载预约详情
				this.loadAppointment()
			}
		},
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			},
			async loadAppointment() {
				try {
					// 使用云对象获取订单详情
					const ordersObj = uniCloud.importObject('orders')
					const res = await ordersObj.getDetail(this.appointmentId)
					
					if (res.code === 0 && res.data) {
						const order = res.data
						this.appointment = {
							studentName: order.student?.username || '未知学生',
							studentEmail: order.student?.email || '',
							studentAvatar: order.student?.avatar_file?.url || '',
							courseType: order.course_name || '作品集指导',
							date: order.appointment_date || '',
							time: order.appointment_time || '',
							duration: (order.duration || 60) / 60
						}
					} else {
						uni.showToast({
							title: res.message || '加载失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('加载订单详情失败:', error)
					if (error.message && error.message.includes('未登录')) {
						uni.showModal({
							title: '提示',
							content: '请先登录',
							showCancel: false
						})
					}
				}
			},
			async handleConfirm() {
				if (this.loading) return
				
				this.loading = true
				
				try {
					// 1. 调用 Zoom API 创建会议
					const zoomResult = await this.createZoomMeeting()
					
					if (!zoomResult.success) {
						throw new Error('创建会议失败')
					}
					
					// 2. 调用 Brevo 发送邮件
					const emailResult = await this.sendEmail(zoomResult.data)
					
					if (!emailResult.success) {
						throw new Error('发送邮件失败')
					}
					
					// 3. 更新订单状态（包含 Zoom 信息）
					await this.updateAppointmentStatus('confirmed', {
						zoom_meeting_id: zoomResult.data.meetingId || zoomResult.data.id,
						zoom_join_url: zoomResult.data.joinUrl || zoomResult.data.join_url
					})
					
					uni.showToast({
						title: this.$t('appointment.confirmSuccess'),
						icon: 'success'
					})
					
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
					
				} catch (error) {
					console.error('确认预约失败:', error)
					uni.showToast({
						title: this.$t('appointment.confirmFailed'),
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},
			async createZoomMeeting() {
				try {
					const result = await uniCloud.callFunction({
						name: 'zoom',
						data: {
							action: 'createMeeting',
							topic: `${this.appointment.courseType} - ${this.appointment.studentName}`,
							duration: this.appointment.duration * 60,
							start_time: `${this.appointment.date}T${this.appointment.time.split(' - ')[0]}:00`
						}
					})
					
					return {
						success: true,
						data: result.result
					}
				} catch (error) {
					console.error('创建 Zoom 会议失败:', error)
					return {
						success: false,
						error: error.message
					}
				}
			},
			async sendEmail(zoomData) {
				try {
					const result = await uniCloud.callFunction({
						name: 'brevo',
						data: {
							action: 'sendAppointmentEmail',
							data: {
								studentEmail: this.appointment.studentEmail,
								mentorEmail: 'mentor@artris.com', // 从用户信息获取
								studentName: this.appointment.studentName,
								mentorName: 'Zhang Laoshi', // 从用户信息获取
								appointmentDate: this.appointment.date,
								appointmentTime: this.appointment.time,
								zoomJoinUrl: zoomData.joinUrl
							}
						}
					})
					
					return {
						success: result.result.code === 0,
						data: result.result
					}
				} catch (error) {
					console.error('发送邮件失败:', error)
					return {
						success: false,
						error: error.message
					}
				}
			},
			async updateAppointmentStatus(status, zoomData = {}) {
				try {
					// 使用云对象更新订单状态
					const ordersObj = uniCloud.importObject('orders')
					const res = await ordersObj.updateStatus(this.appointmentId, status, zoomData)
					
					if (res.code !== 0) {
						throw new Error(res.message || '更新订单状态失败')
					}
					
					return res
				} catch (error) {
					console.error('更新订单状态失败:', error)
					throw error
				}
			},
			handleReject() {
				uni.showModal({
					title: this.$t('common.confirm'),
					content: '确定要拒绝这个预约吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 拒绝订单逻辑（取消订单）
								await this.updateAppointmentStatus('cancelled')
								uni.showToast({
									title: '已拒绝',
									icon: 'success'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							} catch (error) {
								uni.showToast({
									title: error.message || '操作失败',
									icon: 'none'
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.appointment-detail-page {
		min-height: 100vh;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 32rpx;
	}
	
	.info-section {
		padding: 32rpx;
		border-radius: 24rpx;
		margin-bottom: 32rpx;
	}
	
	.section-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 24rpx;
	}
	
	.student-card {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}
	
	.student-avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		background-color: #f0f0f0;
	}
	
	.student-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.student-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.student-email {
		font-size: 24rpx;
		color: #999;
	}
	
	.info-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.info-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
	
	.info-label {
		font-size: 28rpx;
		color: #666;
	}
	
	.info-value {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}
	
	.actions-section {
		display: flex;
		gap: 24rpx;
		margin-top: 48rpx;
	}
	
	.action-btn {
		flex: 1;
		padding: 24rpx;
		border-radius: 16rpx;
		border: none;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.reject-btn {
		background-color: #f0f0f0;
		color: #666;
	}
	
	.confirm-btn {
		color: #fff;
	}
	
	.action-btn[disabled] {
		opacity: 0.6;
	}
</style>
