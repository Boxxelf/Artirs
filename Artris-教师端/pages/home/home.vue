<template>
	<view class="home-page">
		<Header :title="$t('home.title')" :showBadge="true" @rightClick="handleNotification">
			<view slot="right" class="header-right-content">
				<view class="language-switch" @click.stop="toggleLanguage">
					<text class="lang-text">{{ currentLang === 'zh' ? 'EN' : '中文' }}</text>
				</view>
				<view class="icon-btn" @click.stop="handleNotification">
					<uni-icons type="bell" size="24" color="#666"></uni-icons>
					<view class="badge"></view>
				</view>
			</view>
		</Header>
		
		<view class="content">
			<!-- 个人资料卡片 -->
			<view class="profile-section">
				<view class="profile-card">
					<view class="avatar-container">
						<image class="avatar" :src="teacherInfo.avatar" mode="aspectFill"></image>
						<view class="verified-badge">
							<uni-icons type="checkmarkempty" size="14" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="profile-info">
						<text class="name">{{ teacherInfo.name }}</text>
						<text class="title">{{ $t('home.professionalMentor') }}</text>
						<text class="school">{{ teacherInfo.school }}</text>
					</view>
				</view>
			</view>
			
			<!-- 收入卡片 -->
			<view class="income-card glass-card">
				<view class="income-header">
					<text class="income-label">{{ $t('home.expectedIncome') }}</text>
					<view class="view-bill" @click="goToEarnings">
						<text class="view-bill-text">{{ $t('home.viewBill') }}</text>
						<uni-icons type="right" size="14" color="#FF6B35"></uni-icons>
					</view>
				</view>
				<view class="income-amount">
					<text class="currency">¥</text>
					<text class="amount">12,500</text>
				</view>
				<view class="income-footer">
					<view class="hours-badge">
						<uni-icons type="calendar" size="18" color="#FF6B35"></uni-icons>
						<text class="hours-text">{{ $t('home.completedHours') }}: 24h</text>
					</view>
				</view>
			</view>
			
			<!-- 待处理事项 -->
			<view class="pending-section">
				<view class="pending-card glass-card" @click="goToSchedule">
					<view class="pending-icon accent-bg">
						<uni-icons type="calendar" size="24" color="#fff"></uni-icons>
					</view>
					<view class="pending-info">
						<text class="pending-label">{{ $t('home.pendingConfirm') }}</text>
						<text class="pending-value">2{{ $t('home.newAppointments') }}</text>
					</view>
				</view>
				<view class="pending-card glass-card">
					<view class="pending-icon primary-bg">
						<uni-icons type="star" size="24" color="#fff"></uni-icons>
					</view>
					<view class="pending-info">
						<text class="pending-label">{{ $t('home.pendingReply') }}</text>
						<text class="pending-value">1{{ $t('home.newReviews') }}</text>
					</view>
				</view>
			</view>
			
			<!-- 今日课表 -->
			<view class="schedule-section">
				<view class="section-header">
					<text class="section-title">{{ $t('home.todaySchedule') }}</text>
					<text class="section-date">2023.10.24</text>
				</view>
				
				<!-- 进行中的课程 -->
				<view class="class-card active-class" v-if="currentClass">
					<view class="class-badge">{{ $t('home.inProgress') }}</view>
					<view class="class-header">
						<view class="class-student">
							<image class="student-avatar" :src="currentClass.studentAvatar" mode="aspectFill"></image>
							<view class="student-info">
								<text class="student-name">{{ currentClass.studentName }}</text>
								<text class="course-name">{{ currentClass.courseName }}</text>
							</view>
						</view>
						<view class="class-time">
							<text class="time-range">{{ currentClass.timeRange }}</text>
							<text class="time-left">{{ $t('home.minutesLeft', { minutes: currentClass.minutesLeft }) }}</text>
						</view>
					</view>
					<button class="enter-btn primary-bg" @click="enterClassroom(currentClass.id)">
						<uni-icons type="videocam" size="20" color="#fff"></uni-icons>
						<text class="enter-text">{{ $t('home.enterClassroom') }}</text>
					</button>
				</view>
				
				<!-- 今日其他课程 -->
				<view 
					v-for="(classItem, index) in todayClasses" 
					:key="index"
					class="class-card"
					@click="viewClassDetail(classItem.id)"
				>
					<view class="class-header">
						<view class="class-student">
							<image class="student-avatar" :src="classItem.studentAvatar" mode="aspectFill"></image>
							<view class="student-info">
								<text class="student-name">{{ classItem.studentName }}</text>
								<text class="course-name">{{ classItem.courseName }}</text>
							</view>
						</view>
						<view class="class-time">
							<text class="time-range">{{ classItem.timeRange }}</text>
							<text class="time-label">{{ $t('home.laterToday') }}</text>
						</view>
					</view>
				</view>
			</view>
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
				currentLang: 'zh',
				teacherInfo: {
					name: 'Zhang Laoshi',
					avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOuBhXWLMC5dnN26A_egpSOtmZW8SYgolExbubdhGFsqTpSDxkLM747DPRcF12-CgE5bVbmODaKwaz0hBJAzwJHzFj4MMZHR_6b3p0Biic1tvKKC7H6IXq6YvuxkbHsb5oHRSvvbC6qTi7W7aBdrPMpWLfEs2WXCQz2oTyY-6Lk-pyDI7dHfupuMNKCMbQ2KjnXUy-PQL4E5B_Od--V6LJu8UsZo_SeBKKTnG0dIGqwNGa1N9ToAlyHmC6Y1ITq48SlbSihROq-1a2',
					school: 'Rhode Island School of Design'
				},
				currentClass: {
					id: '1',
					studentName: 'Li Hua (李华)',
					studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBknlES0wQDeF2sr5hQS532ikgkjc5rAdu4n2QvnsOCctcHAzab1khpHYKHFRvgTtk6sXfNUlUdoY1fyFVsZT5vIGK0Zoqd9wApg47d4BPRxvSog4ehB0oYQqtJ5BroNhXHVl1BABK1ZAEGJeQ_Qq5wwAWPeSr41Uq4M1qwf86TD7ltzqq6IenwC3wyMGxq8uwtQuR6UnZkj_9C3yRYN0Ty7sYKESFZJqw1E9A4No6pY0AfZkACOjhTPfjm0mGgOv-B2-D8zhgrJWsn',
					courseName: '当代艺术基础课程',
					timeRange: '14:00 - 15:00',
					minutesLeft: 5
				},
				todayClasses: [
					{
						id: '2',
						studentName: 'Wang Fang (王芳)',
						studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA4j1oAYugUrY7vv-wZggpeOQsdQ6Ns9hRKTCJPL47_s3ZD3xdGDqqYtlHeK2NvJabuB1GFtD_zsfVozO1_TpP8GG-E0xYMtITbqqSlrtIVbWgbQOfCRuF8B4QO2QgVMDbXUc9kzf1m7XKRMLRBBe46YcOfe6vfKc6q_tn4RbUgUTAL6515S7jTGVW7rCc7O-3Fh19E03HArdRPrRyShhkvNTqwPDi-sN6BtTFREKlTDdyKFznwnxHpic2j0JKGvBUQY6S8mj3rlGQ',
						courseName: '作品集点评与指导',
						timeRange: '16:30 - 17:30'
					}
				]
			}
		},
		onLoad() {
			this.currentLang = i18n.getLanguage()
		},
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			},
			toggleLanguage() {
				const newLang = this.currentLang === 'zh' ? 'en' : 'zh'
				i18n.setLanguage(newLang)
				this.currentLang = newLang
				uni.showToast({
					title: this.$t('common.success'),
					icon: 'success'
				})
				// 重新加载页面以应用新语言
				setTimeout(() => {
					this.$forceUpdate()
				}, 100)
			},
			handleNotification() {
				uni.navigateTo({
					url: '/pages/messages/messages'
				})
			},
			goToEarnings() {
				uni.redirectTo({
					url: '/pages/earnings/earnings'
				})
			},
			goToSchedule() {
				uni.redirectTo({
					url: '/pages/schedule/schedule'
				})
			},
			enterClassroom(classId) {
				// 进入课堂逻辑
				uni.navigateTo({
					url: `/pages/classroom/classroom?id=${classId}`
				})
			},
			viewClassDetail(classId) {
				// 查看课程详情
			}
		}
	}
</script>

<style scoped>
	.home-page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 32rpx;
	}
	
	.profile-section {
		margin-bottom: 32rpx;
	}
	
	.profile-card {
		display: flex;
		align-items: center;
		gap: 40rpx;
	}
	
	.avatar-container {
		position: relative;
	}
	
	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		border: 4rpx solid #FF6B35;
		padding: 4rpx;
	}
	
	.verified-badge {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 48rpx;
		height: 48rpx;
		background-color: #00B4D8;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
	}
	
	.profile-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.name {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}
	
	.title {
		font-size: 28rpx;
		color: #FF6B35;
		font-weight: 500;
	}
	
	.school {
		font-size: 24rpx;
		color: #999;
	}
	
	.income-card {
		padding: 48rpx;
		border-radius: 24rpx;
		margin-bottom: 32rpx;
		position: relative;
		overflow: hidden;
	}
	
	.income-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}
	
	.income-label {
		font-size: 28rpx;
		color: #666;
		font-weight: 500;
	}
	
	.view-bill {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.view-bill-text {
		font-size: 24rpx;
		color: #FF6B35;
		font-weight: bold;
	}
	
	.income-amount {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin-bottom: 48rpx;
	}
	
	.currency {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}
	
	.amount {
		font-size: 80rpx;
		font-weight: 900;
		color: #333;
		letter-spacing: -2rpx;
	}
	
	.income-footer {
		display: flex;
		align-items: center;
	}
	
	.hours-badge {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 12rpx 24rpx;
		background-color: rgba(255, 107, 53, 0.1);
		border-radius: 48rpx;
	}
	
	.hours-text {
		font-size: 28rpx;
		color: #FF6B35;
		font-weight: 500;
	}
	
	.pending-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32rpx;
		margin-bottom: 32rpx;
	}
	
	.pending-card {
		display: flex;
		align-items: center;
		gap: 24rpx;
		padding: 32rpx;
		border-radius: 16rpx;
		border-left: 8rpx solid;
	}
	
	.pending-card:first-child {
		border-left-color: #00B4D8;
	}
	
	.pending-card:last-child {
		border-left-color: #FF6B35;
	}
	
	.pending-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.pending-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.pending-label {
		font-size: 24rpx;
		color: #999;
	}
	
	.pending-value {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.schedule-section {
		margin-top: 32rpx;
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
		font-size: 24rpx;
		color: #999;
		background-color: rgba(0, 0, 0, 0.05);
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
	}
	
	.class-card {
		background-color: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		margin-bottom: 24rpx;
		border: 2rpx solid rgba(255, 107, 53, 0.2);
		position: relative;
		overflow: hidden;
	}
	
	.active-class {
		border-color: #FF6B35;
	}
	
	.class-badge {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #FF6B35;
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
		padding: 8rpx 24rpx;
		border-radius: 0 0 0 16rpx;
		text-transform: uppercase;
		letter-spacing: 2rpx;
	}
	
	.class-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 32rpx;
	}
	
	.class-student {
		display: flex;
		align-items: center;
		gap: 24rpx;
		flex: 1;
	}
	
	.student-avatar {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		background-color: #f0f0f0;
	}
	
	.student-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.student-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.course-name {
		font-size: 24rpx;
		color: #999;
	}
	
	.class-time {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.time-range {
		font-size: 28rpx;
		font-weight: bold;
		color: #FF6B35;
	}
	
	.time-left,
	.time-label {
		font-size: 20rpx;
		color: #999;
	}
	
	.enter-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		padding: 24rpx;
		border-radius: 16rpx;
		border: none;
	}
	
	.enter-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}
	
	.header-right-content {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.language-switch {
		padding: 8rpx 16rpx;
	}
	
	.lang-text {
		font-size: 28rpx;
		color: #FF6B35;
		font-weight: 600;
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
