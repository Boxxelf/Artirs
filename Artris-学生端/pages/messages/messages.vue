<template>
	<view class="messages-page">
		<!-- 头部 -->
		<view class="header">
			<view class="header-content">
				<text class="header-title">{{ $t('messages.title') }}</text>
			</view>
		</view>

		<!-- 消息列表 -->
		<view class="message-list">
			<view 
				v-for="conversation in conversations" 
				:key="conversation.other_user_id"
				class="message-item"
				@click="goToChat(conversation.other_user_id)"
			>
				<view class="avatar-container">
					<image v-if="conversation.other_user?.avatar_file?.url" class="avatar" :src="conversation.other_user.avatar_file.url" mode="aspectFill"></image>
					<view v-else class="avatar-placeholder">
						<uni-icons type="contact-filled" size="40" color="#00B4D8"></uni-icons>
					</view>
				</view>
				<view class="message-content">
					<view class="message-header">
						<text class="user-name">{{ conversation.other_user?.username || '用户' }}</text>
						<text class="message-time">{{ formatTime(conversation.create_date) }}</text>
					</view>
					<text class="message-text">{{ conversation.content }}</text>
				</view>
				<view v-if="conversation.unread" class="unread-badge"></view>
			</view>

			<view v-if="loading" class="loading">
				<text>{{ $t('common.loading') }}</text>
			</view>

			<view v-if="!loading && conversations.length === 0" class="empty">
				<text>{{ $t('messages.noMessages') }}</text>
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
				conversations: [],
				loading: false
			}
		},
		onLoad() {
			this.loadConversations()
		},
		onShow() {
			this.loadConversations()
		},
		methods: {
			async loadConversations() {
				this.loading = true
				try {
					const userInfo = uni.getStorageSync('userInfo') || {}
					const res = await uniCloud.callFunction({
						name: 'messages',
						data: {
							action: 'getList',
							data: {
								user_id: userInfo._id || 'test_student'
							}
						}
					})
					
					if (res.result.code === 0) {
						this.conversations = res.result.data || []
					}
				} catch (error) {
					console.error('加载消息失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},
			goToChat(userId) {
				uni.navigateTo({
					url: `/pages/chat/chat?userId=${userId}`
				})
			},
			formatTime(timestamp) {
				if (!timestamp) return ''
				const date = new Date(timestamp)
				const now = new Date()
				const diff = now - date
				const minutes = Math.floor(diff / 60000)
				
				if (minutes < 1) return '刚刚'
				if (minutes < 60) return `${minutes}分钟前`
				if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
				return `${date.getMonth() + 1}-${date.getDate()}`
			}
		}
	}
</script>

<style scoped>
	.messages-page {
		min-height: 100vh;
		background-color: #ffffff;
		padding-bottom: 120rpx;
	}

	.header {
		background-color: #ffffff;
		padding: 32rpx;
		padding-top: calc(32rpx + env(safe-area-inset-top));
		border-bottom: 1px solid #e5e5e5;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}

	.message-list {
		padding: 0 32rpx;
	}

	.message-item {
		display: flex;
		align-items: center;
		gap: 24rpx;
		padding: 32rpx 0;
		border-bottom: 1px solid #f0f0f0;
		position: relative;
	}

	.avatar-container {
		position: relative;
	}

	.avatar {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
	}

	.avatar-placeholder {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.message-content {
		flex: 1;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.user-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.message-time {
		font-size: 24rpx;
		color: #999;
	}

	.message-text {
		font-size: 28rpx;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 400rpx;
	}

	.unread-badge {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #ff6b6b;
	}

	.loading, .empty {
		text-align: center;
		padding: 64rpx;
		color: #999;
		font-size: 28rpx;
	}

</style>
