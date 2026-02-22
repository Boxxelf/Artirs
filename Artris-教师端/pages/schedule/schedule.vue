<template>
	<view class="schedule-page">
		<Header :title="$t('schedule.title')" rightIcon="settings" @rightClick="handleSettings"></Header>
		
		<view class="content">
			<!-- 日历 -->
			<view class="calendar-section">
				<view class="calendar-card glass-card">
					<view class="calendar-header">
						<view class="month-nav" @click="prevMonth">
							<uni-icons type="left" size="20" color="#666"></uni-icons>
						</view>
						<text class="month-title">{{ currentMonth }}</text>
						<view class="month-nav" @click="nextMonth">
							<uni-icons type="right" size="20" color="#666"></uni-icons>
						</view>
					</view>
					
					<view class="weekdays">
						<view v-for="day in weekdays" :key="day" class="weekday">{{ $t(day) }}</view>
					</view>
					
					<view class="calendar-grid">
						<view 
							v-for="(date, index) in calendarDates" 
							:key="index"
							class="date-cell"
							:class="{ 
								'other-month': date.otherMonth,
								'has-class': date.hasClass,
								'today': date.isToday,
								'selected': date.isSelected
							}"
							@click="selectDate(date)"
						>
							<text class="date-number">{{ date.day }}</text>
							<view v-if="date.hasClass" class="date-dot"></view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 预约设置 -->
			<view class="settings-section">
				<view class="settings-card glass-card">
					<view class="settings-content">
						<view class="settings-icon accent-bg">
							<uni-icons type="wallet" size="24" color="#fff"></uni-icons>
						</view>
						<view class="settings-info">
							<text class="settings-title">{{ $t('schedule.bookingSettings') }}</text>
							<text class="settings-desc">{{ $t('schedule.currentPrice') }}: <text class="price">¥300/{{ $t('common.hour') }}</text></text>
						</view>
					</view>
					<button class="modify-btn primary-bg" @click="modifySettings">{{ $t('schedule.modifySettings') }}</button>
				</view>
			</view>
			
			<!-- 今日日程 -->
			<view class="today-section">
				<view class="section-header">
					<text class="section-title">{{ $t('schedule.todaySchedule') }}</text>
					<text class="section-date">{{ todayDate }}</text>
				</view>
				
				<view class="schedule-list">
					<view 
						v-for="(item, index) in todaySchedule" 
						:key="index"
						class="schedule-item"
						:class="{ 'busy-time': item.isBusy }"
						@click="!item.isBusy && viewAppointment(item.id)"
					>
						<view class="time-column">
							<text class="time-start">{{ item.startTime }}</text>
							<text class="time-end">{{ item.endTime }}</text>
						</view>
						<view class="schedule-info">
							<view class="schedule-header">
								<text class="schedule-name">{{ item.name }}</text>
								<view class="status-badge" :class="item.status">
									<text class="status-text">{{ getStatusText(item.status) }}</text>
								</view>
							</view>
							<text class="schedule-desc">{{ item.description }}</text>
						</view>
						<view class="schedule-action">
							<uni-icons v-if="!item.isBusy" type="more" size="20" color="#999"></uni-icons>
							<uni-icons v-else type="close" size="16" color="#999"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加例外按钮 -->
		<view class="fab">
			<button class="fab-btn primary-bg" @click="addException">
				<uni-icons type="plus" size="24" color="#fff"></uni-icons>
				<text class="fab-text">{{ $t('schedule.addException') }}</text>
			</button>
		</view>
		
		<BottomNav></BottomNav>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n.js'
	import Header from '@/components/Header/Header.vue'
	import BottomNav from '@/components/BottomNav/BottomNav.vue'
	
	export default {
		components: {
			Header,
			BottomNav
		},
		data() {
			return {
				currentDate: new Date(),
				weekdays: ['common.sunday', 'common.monday', 'common.tuesday', 'common.wednesday', 'common.thursday', 'common.friday', 'common.saturday'],
				todaySchedule: [
					{
						id: '1',
						name: '李伟',
						startTime: '10:00',
						endTime: '11:00',
						description: 'Portfolio Review · 作品集指导',
						status: 'confirmed'
					},
					{
						id: '2',
						name: '张芳',
						startTime: '14:00',
						endTime: '15:30',
						description: '基础素描 · 1.5小时',
						status: 'pending'
					},
					{
						id: '3',
						name: '忙碌时间',
						startTime: '16:30',
						endTime: '18:00',
						description: '私人行程，不接受预约',
						status: 'exception',
						isBusy: true
					}
				]
			}
		},
		computed: {
			currentMonth() {
				const year = this.currentDate.getFullYear()
				const month = this.currentDate.getMonth() + 1
				return `${year}年 ${month}月`
			},
			todayDate() {
				const date = new Date()
				const weekdays = ['日', '一', '二', '三', '四', '五', '六']
				const month = date.getMonth() + 1
				const day = date.getDate()
				const weekday = weekdays[date.getDay()]
				return `${month}月${day}日, 周${weekday}`
			},
			calendarDates() {
				const year = this.currentDate.getFullYear()
				const month = this.currentDate.getMonth()
				const firstDay = new Date(year, month, 1)
				const lastDay = new Date(year, month + 1, 0)
				const startDate = new Date(firstDay)
				startDate.setDate(startDate.getDate() - startDate.getDay())
				
				const dates = []
				const today = new Date()
				today.setHours(0, 0, 0, 0)
				
				for (let i = 0; i < 42; i++) {
					const date = new Date(startDate)
					date.setDate(startDate.getDate() + i)
					const isOtherMonth = date.getMonth() !== month
					const isToday = date.getTime() === today.getTime()
					
					dates.push({
						day: date.getDate(),
						date: date,
						otherMonth: isOtherMonth,
						isToday: isToday,
						hasClass: !isOtherMonth && (date.getDate() === 5 || date.getDate() === 6 || date.getDate() === 10),
						isSelected: false
					})
				}
				
				return dates
			}
		},
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			},
			prevMonth() {
				const newDate = new Date(this.currentDate)
				newDate.setMonth(newDate.getMonth() - 1)
				this.currentDate = newDate
			},
			nextMonth() {
				const newDate = new Date(this.currentDate)
				newDate.setMonth(newDate.getMonth() + 1)
				this.currentDate = newDate
			},
			selectDate(date) {
				if (!date.otherMonth) {
					// 选择日期逻辑
				}
			},
			getStatusText(status) {
				const statusMap = {
					confirmed: this.$t('schedule.confirmed'),
					pending: this.$t('schedule.pendingConfirm'),
					exception: this.$t('schedule.exception')
				}
				return statusMap[status] || ''
			},
			handleSettings() {
				// 设置逻辑
			},
			modifySettings() {
				// 修改设置逻辑
			},
			viewAppointment(id) {
				uni.navigateTo({
					url: `/pages/appointment-detail/appointment-detail?id=${id}`
				})
			},
			addException() {
				// 添加例外逻辑
			}
		}
	}
</script>

<style scoped>
	.schedule-page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 32rpx;
	}
	
	.calendar-section {
		margin-bottom: 32rpx;
	}
	
	.calendar-card {
		padding: 32rpx;
		border-radius: 24rpx;
		border: 2rpx solid rgba(255, 107, 53, 0.1);
	}
	
	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;
	}
	
	.month-nav {
		padding: 8rpx;
	}
	
	.month-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 8rpx;
		margin-bottom: 16rpx;
	}
	
	.weekday {
		text-align: center;
		font-size: 22rpx;
		font-weight: bold;
		color: #999;
		text-transform: uppercase;
	}
	
	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 8rpx;
	}
	
	.date-cell {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		border-radius: 16rpx;
	}
	
	.date-cell.other-month {
		color: #ccc;
	}
	
	.date-cell.has-class .date-number {
		font-weight: 500;
	}
	
	.date-cell.today {
		background-color: #FF6B35;
		color: #fff;
		font-weight: bold;
	}
	
	.date-cell.selected {
		background-color: rgba(255, 107, 53, 0.1);
	}
	
	.date-number {
		font-size: 28rpx;
	}
	
	.date-dot {
		position: absolute;
		bottom: 8rpx;
		width: 8rpx;
		height: 8rpx;
		background-color: #FF6B35;
		border-radius: 50%;
	}
	
	.date-cell.today .date-dot {
		background-color: #fff;
	}
	
	.settings-section {
		margin-bottom: 32rpx;
	}
	
	.settings-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		border-radius: 24rpx;
		background-color: rgba(255, 107, 53, 0.05);
		border: 2rpx solid rgba(255, 107, 53, 0.1);
	}
	
	.settings-content {
		display: flex;
		align-items: center;
		gap: 24rpx;
		flex: 1;
	}
	
	.settings-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.settings-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.settings-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.settings-desc {
		font-size: 24rpx;
		color: #999;
	}
	
	.price {
		color: #FF6B35;
		font-weight: bold;
	}
	
	.modify-btn {
		padding: 16rpx 32rpx;
		border-radius: 16rpx;
		border: none;
		font-size: 24rpx;
		font-weight: bold;
		color: #fff;
	}
	
	.today-section {
		margin-top: 48rpx;
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
	
	.section-date {
		font-size: 28rpx;
		color: #999;
	}
	
	.schedule-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.schedule-item {
		display: flex;
		align-items: center;
		gap: 32rpx;
		padding: 32rpx;
		background-color: #fff;
		border-radius: 16rpx;
		border: 2rpx solid #f0f0f0;
	}
	
	.schedule-item.busy-time {
		background-color: #f9f9f9;
		border-style: dashed;
	}
	
	.time-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 140rpx;
		padding-right: 32rpx;
		border-right: 2rpx solid #f0f0f0;
	}
	
	.time-start {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.time-end {
		font-size: 20rpx;
		color: #999;
	}
	
	.schedule-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.schedule-header {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.schedule-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.schedule-item.busy-time .schedule-name {
		color: #999;
	}
	
	.status-badge {
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: 500;
	}
	
	.status-badge.confirmed {
		background-color: rgba(0, 191, 165, 0.1);
		color: #00bfa5;
	}
	
	.status-badge.pending {
		background-color: rgba(255, 193, 7, 0.1);
		color: #ffc107;
	}
	
	.status-badge.exception {
		background-color: rgba(158, 158, 158, 0.1);
		color: #9e9e9e;
	}
	
	.status-text {
		font-size: 20rpx;
	}
	
	.schedule-desc {
		font-size: 28rpx;
		color: #999;
	}
	
	.schedule-item.busy-time .schedule-desc {
		font-style: italic;
	}
	
	.schedule-action {
		padding: 8rpx;
	}
	
	.fab {
		position: fixed;
		bottom: 200rpx;
		right: 48rpx;
		z-index: 99;
	}
	
	.fab-btn {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 24rpx 48rpx;
		border-radius: 48rpx;
		border: none;
		box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.3);
	}
	
	.fab-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #fff;
	}
</style>
