<template>
	<view class="profile-page">
		<!-- 头部 -->
		<view class="header">
			<view class="header-top">
				<uni-icons type="settings" size="24" color="#333" @click="goToSettings"></uni-icons>
			</view>
			<view class="profile-info" v-if="isLoggedIn">
				<view class="avatar-container">
					<image v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<view v-else class="avatar-placeholder">
						<uni-icons type="contact-filled" size="80" color="#00B4D8"></uni-icons>
					</view>
				</view>
				<text class="user-name">{{ userInfo.username || '用户' }}</text>
				<text class="user-school">{{ userInfo.school || 'Rhode Island School of Design' }}</text>
			</view>
			<view class="login-prompt" v-else>
				<view class="avatar-container">
					<view class="avatar-placeholder">
						<uni-icons type="contact-filled" size="80" color="#00B4D8"></uni-icons>
					</view>
				</view>
				<text class="login-title">请先登录</text>
				<button class="login-button" @click="goToLogin">立即登录</button>
			</view>
		</view>

		<!-- 统计数据 -->
		<view class="stats" v-if="isLoggedIn">
			<view class="stat-item">
				<text class="stat-value">48</text>
				<text class="stat-label">{{ $t('profile.totalHours') }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">12</text>
				<text class="stat-label">{{ $t('profile.favoriteMentors') }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">8</text>
				<text class="stat-label">{{ $t('profile.completedReviews') }}</text>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="menu-list" v-if="isLoggedIn">
			<view class="menu-item" @click="goToFolder">
				<uni-icons type="folder" size="24" color="#00B4D8"></uni-icons>
				<text class="menu-text">{{ $t('profile.applicationFolder') }}</text>
				<uni-icons type="right" size="18" color="#ccc"></uni-icons>
			</view>
			<view class="menu-item">
				<uni-icons type="heart" size="24" color="#00B4D8"></uni-icons>
				<text class="menu-text">{{ $t('profile.myFavorites') }}</text>
				<uni-icons type="right" size="18" color="#ccc"></uni-icons>
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
				userInfo: {},
				isLoggedIn: false
			}
		},
		onLoad() {
			this.checkLoginStatus()
		},
		onShow() {
			this.checkLoginStatus()
		},
		methods: {
			checkLoginStatus() {
				const userInfo = uni.getStorageSync('userInfo')
				const uniIdToken = uni.getStorageSync('uni_id_token')
				
				if (userInfo && userInfo._id && uniIdToken) {
					this.isLoggedIn = true
					this.userInfo = userInfo
				} else {
					this.isLoggedIn = false
					this.userInfo = {}
				}
			},
			loadUserInfo() {
				const userInfo = uni.getStorageSync('userInfo') || {}
				this.userInfo = userInfo
			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			goToSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings'
				})
			},
			goToFolder() {
				uni.navigateTo({
					url: '/pages/folder/folder'
				})
			}
		}
	}
</script>

<style scoped>
	.profile-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 120rpx;
	}

	.header {
		background-color: #ffffff;
		padding: 48rpx 32rpx;
		padding-top: calc(48rpx + env(safe-area-inset-top));
		text-align: center;
	}

	.header-top {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 32rpx;
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar-container {
		margin-bottom: 32rpx;
	}

	.avatar {
		width: 192rpx;
		height: 192rpx;
		border-radius: 50%;
		border: 8rpx solid #ffffff;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	}

	.avatar-placeholder {
		width: 192rpx;
		height: 192rpx;
		border-radius: 50%;
		border: 8rpx solid #ffffff;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-name {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.user-school {
		font-size: 28rpx;
		color: #999;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32rpx;
		padding: 48rpx 32rpx;
	}

	.stat-item {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 32rpx;
		text-align: center;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.stat-value {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.stat-label {
		display: block;
		font-size: 24rpx;
		color: #999;
	}

	.menu-list {
		padding: 0 32rpx;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 32rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.menu-text {
		flex: 1;
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}

	.login-prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48rpx 0;
	}

	.login-title {
		font-size: 32rpx;
		color: #666;
		margin-bottom: 32rpx;
	}

	.login-button {
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 24rpx 64rpx;
		font-size: 28rpx;
		font-weight: bold;
		box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
	}

</style>
