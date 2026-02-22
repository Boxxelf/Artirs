<template>
	<view class="settings-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('settings.title') }}</text>
			<view class="nav-placeholder"></view>
		</view>

		<view class="content">
			<!-- 语言设置 -->
			<view class="setting-section">
				<view class="setting-item">
					<text class="setting-label">{{ $t('settings.language') }}</text>
					<view class="setting-value" @click="showLanguagePicker">
						<text>{{ currentLanguage === 'zh' ? $t('settings.chinese') : $t('settings.english') }}</text>
						<uni-icons type="right" size="18" color="#ccc"></uni-icons>
					</view>
				</view>
			</view>

			<!-- 通知设置 -->
			<view class="setting-section">
				<view class="setting-item">
					<text class="setting-label">{{ $t('settings.notifications') }}</text>
					<switch :checked="notificationsEnabled" @change="toggleNotifications" color="#00B4D8"></switch>
				</view>
			</view>

			<!-- 退出登录 -->
			<view class="setting-section">
				<button class="logout-btn" @click="handleLogout">
					{{ $t('settings.logout') }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n.js'
	
	export default {
		data() {
			return {
				currentLanguage: 'zh',
				notificationsEnabled: true
			}
		},
		onLoad() {
			this.currentLanguage = i18n.getLanguage()
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			showLanguagePicker() {
				uni.showActionSheet({
					itemList: [this.$t('settings.chinese'), this.$t('settings.english')],
					success: (res) => {
						const lang = res.tapIndex === 0 ? 'zh' : 'en'
						i18n.setLanguage(lang)
						this.currentLanguage = lang
						uni.showToast({
							title: '语言已切换',
							icon: 'success'
						})
						// 重新加载页面以应用新语言
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}, 1000)
					}
				})
			},
			toggleNotifications(e) {
				this.notificationsEnabled = e.detail.value
			},
			async handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								// 调用 uni-id 退出登录接口
								const uniIdCo = uniCloud.importObject('uni-id-co', {
									customUI: true
								})
								await uniIdCo.logout()
							} catch (error) {
								console.error('退出登录失败:', error)
							}
							
							// 清除本地存储
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('uni_id_token')
							uni.removeStorageSync('uni_id_token_expired')
							
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							})
							
							// 跳转到首页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/home/home'
								})
							}, 1000)
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.settings-page {
		min-height: 100vh;
		background-color: #f5f6f8;
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

	.setting-section {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.setting-label {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}

	.setting-value {
		display: flex;
		align-items: center;
		gap: 16rpx;
		font-size: 28rpx;
		color: #666;
	}

	.logout-btn {
		width: 100%;
		background-color: transparent;
		color: #ff6b6b;
		border: 1px solid #ff6b6b;
		border-radius: 24rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
