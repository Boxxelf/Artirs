<template>
	<view class="booking-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('booking.selectTime') }}</text>
			<view class="nav-placeholder"></view>
		</view>

		<view class="content">
			<!-- 日期选择 -->
			<view class="date-section">
				<view class="section-header">
					<text class="section-title">{{ currentYear }}年 {{ currentMonth }}月</text>
					<uni-icons type="calendar" size="20" color="#00B4D8"></uni-icons>
				</view>
				<scroll-view class="date-scroll" scroll-x="true" :show-scrollbar="false">
					<view 
						v-for="(date, index) in availableDates" 
						:key="index"
						class="date-item"
						:class="{ active: selectedDate === date.value }"
						@click="selectDate(date.value)"
					>
						<text class="date-weekday">{{ date.weekday }}</text>
						<text class="date-day">{{ date.day }}</text>
					</view>
				</scroll-view>
			</view>

			<!-- 时间选择 -->
			<view class="time-section">
				<view class="section-header">
					<text class="section-title">{{ $t('booking.selectTime') }}</text>
				</view>
				<view class="time-grid">
					<view 
						v-for="(time, index) in availableTimes" 
						:key="index"
						class="time-item"
						:class="{ active: selectedTime === time }"
						@click="selectTime(time)"
					>
						{{ time }}
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-bar">
			<button class="next-btn" :disabled="!selectedDate || !selectedTime" @click="goToConfirm">
				{{ $t('common.next') }}
				<uni-icons type="right" size="16" color="#ffffff"></uni-icons>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mentorId: '',
				selectedDate: '',
				selectedTime: '',
				currentYear: new Date().getFullYear(),
				currentMonth: new Date().getMonth() + 1,
				availableDates: [],
				availableTimes: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
			}
		},
		onLoad(options) {
			if (options.mentorId) {
				this.mentorId = options.mentorId
			}
			this.generateDates()
		},
		methods: {
			generateDates() {
				const dates = []
				const today = new Date()
				for (let i = 0; i < 14; i++) {
					const date = new Date(today)
					date.setDate(today.getDate() + i)
					const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
					const weekday = weekdays[date.getDay()]
					dates.push({
						value: this.formatDate(date),
						day: date.getDate(),
						weekday: weekday
					})
				}
				this.availableDates = dates
			},
			formatDate(date) {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}-${month}-${day}`
			},
			selectDate(date) {
				this.selectedDate = date
			},
			selectTime(time) {
				this.selectedTime = time
			},
			goBack() {
				uni.navigateBack()
			},
			goToConfirm() {
				if (!this.selectedDate || !this.selectedTime) {
					uni.showToast({
						title: '请选择日期和时间',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: `/pages/order-confirm/order-confirm?mentorId=${this.mentorId}&date=${this.selectedDate}&time=${this.selectedTime}`
				})
			}
		}
	}
</script>

<style scoped>
	.booking-page {
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
		padding: 48rpx 32rpx;
	}

	.date-section {
		margin-bottom: 64rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.date-scroll {
		white-space: nowrap;
	}

	.date-item {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 128rpx;
		height: 160rpx;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 24rpx;
		margin-right: 24rpx;
	}

	.date-item.active {
		background-color: #00B4D8;
		border-color: #00B4D8;
	}

	.date-weekday {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.date-item.active .date-weekday {
		color: rgba(255, 255, 255, 0.8);
	}

	.date-day {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.date-item.active .date-day {
		color: #ffffff;
	}

	.time-section {
	}

	.time-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
	}

	.time-item {
		padding: 24rpx;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 16rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.time-item.active {
		background-color: #00B4D8;
		border-color: #00B4D8;
		color: #ffffff;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
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
	}

	.next-btn {
		width: 100%;
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}

	.next-btn[disabled] {
		background-color: #ccc;
		box-shadow: none;
	}
</style>
