<template>
	<view class="profile-page">
		<Header :title="$t('profile.title')" rightIcon="settings" @rightClick="handleSettings"></Header>
		
		<view class="content">
			<!-- 个人资料 -->
			<view class="profile-section">
				<view class="avatar-container">
					<image class="avatar" :src="teacherInfo.avatar" mode="aspectFill"></image>
					<view class="verified-badge">
						<uni-icons type="checkmarkempty" size="16" color="#fff"></uni-icons>
					</view>
				</view>
				<view class="profile-info">
					<text class="name">{{ teacherInfo.name }}</text>
					<text class="title">{{ teacherInfo.school }} · {{ teacherInfo.degree }}</text>
					<view class="badges">
						<view class="badge primary-bg">
							<text class="badge-text">{{ $t('profile.verifiedMentor') }}</text>
						</view>
						<view class="badge success-bg">
							<view class="status-dot"></view>
							<text class="badge-text">{{ $t('profile.accepting') }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 统计数据 -->
			<view class="stats-section">
				<view class="stat-card glass-card">
					<text class="stat-value">128</text>
					<text class="stat-label">{{ $t('profile.totalSessions') }}</text>
				</view>
				<view class="stat-card glass-card">
					<text class="stat-value">4.9</text>
					<text class="stat-label">{{ $t('profile.studentRating') }}</text>
				</view>
				<view class="stat-card glass-card">
					<text class="stat-value primary-color">¥8.6k</text>
					<text class="stat-label">{{ $t('profile.monthlyEarnings') }}</text>
				</view>
			</view>
			
			<!-- 专业身份 -->
			<view class="menu-section">
				<text class="section-label">{{ $t('profile.professionalIdentity') }}</text>
				<view class="menu-card glass-card">
					<view class="menu-item" @click="editProfile">
						<view class="menu-icon primary-bg">
							<uni-icons type="compose" size="24" color="#fff"></uni-icons>
						</view>
						<view class="menu-content">
							<text class="menu-title">{{ $t('profile.mentorProfile') }}</text>
							<text class="menu-desc">{{ $t('profile.updateProfile') }}</text>
						</view>
						<uni-icons type="right" size="20" color="#ccc"></uni-icons>
					</view>
				</view>
			</view>
			
			<!-- 教务管理 -->
			<view class="menu-section">
				<text class="section-label">{{ $t('profile.academicManagement') }}</text>
				<view class="menu-card glass-card">
					<view class="menu-item" @click="serviceSettings">
						<view class="menu-icon primary-bg">
							<uni-icons type="settings" size="24" color="#fff"></uni-icons>
						</view>
						<view class="menu-content">
							<text class="menu-title">{{ $t('profile.serviceSettings') }}</text>
							<text class="menu-desc">{{ $t('profile.defineServices') }}</text>
						</view>
						<uni-icons type="right" size="20" color="#ccc"></uni-icons>
					</view>
					<view class="menu-item" @click="accountPayment">
						<view class="menu-icon primary-bg">
							<uni-icons type="wallet" size="24" color="#fff"></uni-icons>
						</view>
						<view class="menu-content">
							<text class="menu-title">{{ $t('profile.accountPayment') }}</text>
							<text class="menu-desc">{{ $t('profile.managePayment') }}</text>
						</view>
						<uni-icons type="right" size="20" color="#ccc"></uni-icons>
					</view>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view class="logout-section">
				<button class="logout-btn" @click="handleLogout">
					<uni-icons type="closeempty" size="20" color="#ff4757"></uni-icons>
					<text class="logout-text">{{ $t('profile.logout') }}</text>
				</button>
				<text class="version-text">{{ $t('profile.version') }}</text>
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
				teacherInfo: {
					name: '张老师',
					avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJeKs3Yaii9HmmO39mMjZiTI-LbMXxJ9WnS6KPq6TN4iwzJmfNRAGgjPozkECSVX1eAzT2bnhhjvU2Hbz7rkZ2jJ1gUu9wJO1NZ6whUYUziPgRYPknRquis7TLDPucknjwmHluSgVevmqm_Mtez5_Cna6ZIYEWq7WdZnevgO3I8LyDip5CGdfOJIGxs1B4eOqcIxeu3R4wT4RWURMspKvhNXpupf2FlL-6jJcH8yFan38D-L56OOyd7cixmuHnOpnoRXqLvVqiUz6L',
					school: 'RISD',
					degree: 'MFA'
				}
			}
		},
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			},
			handleSettings() {
				// 设置逻辑
			},
			editProfile() {
				// 编辑资料
			},
			serviceSettings() {
				// 服务设置
			},
			accountPayment() {
				// 账户与收款
			},
			handleLogout() {
				uni.showModal({
					title: this.$t('common.confirm'),
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('uniIdToken')
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.profile-page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 48rpx 32rpx;
	}
	
	.profile-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 64rpx;
	}
	
	.avatar-container {
		position: relative;
		margin-bottom: 32rpx;
	}
	
	.avatar {
		width: 192rpx;
		height: 192rpx;
		border-radius: 50%;
		border: 8rpx solid #fff;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	}
	
	.verified-badge {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 64rpx;
		height: 64rpx;
		background-color: #FF6B35;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 4rpx solid #fff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.profile-info {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
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
	
	.badges {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		margin-top: 16rpx;
	}
	
	.badge {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 20rpx;
		border-radius: 48rpx;
	}
	
	.success-bg {
		background-color: rgba(0, 191, 165, 0.1);
	}
	
	.status-dot {
		width: 12rpx;
		height: 12rpx;
		background-color: #00bfa5;
		border-radius: 50%;
	}
	
	.badge-text {
		font-size: 24rpx;
		font-weight: 600;
		color: #333;
	}
	
	.success-bg .badge-text {
		color: #00bfa5;
	}
	
	.stats-section {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
		margin-bottom: 64rpx;
	}
	
	.stat-card {
		padding: 32rpx;
		border-radius: 24rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.stat-value {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}
	
	.stat-label {
		font-size: 20rpx;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 2rpx;
		font-weight: 600;
	}
	
	.menu-section {
		margin-bottom: 48rpx;
	}
	
	.section-label {
		display: block;
		font-size: 24rpx;
		font-weight: bold;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 4rpx;
		margin-bottom: 16rpx;
		padding: 0 16rpx;
	}
	
	.menu-card {
		border-radius: 24rpx;
		overflow: hidden;
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		gap: 32rpx;
		padding: 32rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.menu-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.menu-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}
	
	.menu-desc {
		font-size: 24rpx;
		color: #999;
	}
	
	.logout-section {
		margin-top: 64rpx;
		padding-bottom: 64rpx;
	}
	
	.logout-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		padding: 32rpx;
		background-color: rgba(255, 71, 87, 0.1);
		border: 2rpx solid rgba(255, 71, 87, 0.2);
		border-radius: 24rpx;
		margin-bottom: 48rpx;
	}
	
	.logout-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #ff4757;
	}
	
	.version-text {
		display: block;
		text-align: center;
		font-size: 20rpx;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 4rpx;
	}
</style>
