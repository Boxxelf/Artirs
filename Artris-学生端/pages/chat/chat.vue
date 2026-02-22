<template>
	<view class="chat-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ otherUser?.username || '聊天' }}</text>
			<uni-icons type="list" size="24" color="#333"></uni-icons>
		</view>

		<!-- 消息列表 -->
		<scroll-view class="message-list" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation>
			<view 
				v-for="(message, index) in messages" 
				:key="index"
				class="message-item"
				:class="{ 'message-right': message.from_user_id === currentUserId }"
			>
				<view class="message-bubble" :class="{ 'bubble-right': message.from_user_id === currentUserId }">
					<text class="message-text">{{ message.content }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 输入栏 -->
		<view class="input-bar">
			<input 
				class="message-input" 
				v-model="inputText" 
				:placeholder="$t('messages.inputPlaceholder')"
				@confirm="sendMessage"
			/>
			<button class="send-btn" :class="{ 'send-btn-active': inputText.trim() }" @click="sendMessage" :disabled="!inputText.trim()">
				<uni-icons type="right" size="20" color="#ffffff"></uni-icons>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: '',
				otherUserId: '',
				currentUserId: '',
				otherUser: {},
				messages: [],
				inputText: '',
				scrollTop: 0
			}
		},
		onLoad(options) {
			if (options.userId) {
				this.otherUserId = options.userId
			} else if (options.mentorId) {
				this.otherUserId = options.mentorId
			}
			const userInfo = uni.getStorageSync('userInfo') || {}
			this.currentUserId = userInfo._id || 'test_student'
			this.loadChatHistory()
		},
		methods: {
			async loadChatHistory() {
				try {
					const res = await uniCloud.callFunction({
						name: 'messages',
						data: {
							action: 'getChatHistory',
							data: {
								user_id: this.currentUserId,
								other_user_id: this.otherUserId
							}
						}
					})
					
					if (res.result.code === 0) {
						this.messages = res.result.data || []
						this.$nextTick(() => {
							this.scrollToBottom()
						})
					}
				} catch (error) {
					console.error('加载聊天记录失败:', error)
				}
			},
			async sendMessage() {
				if (!this.inputText.trim()) return
				
				try {
					const res = await uniCloud.callFunction({
						name: 'messages',
						data: {
							action: 'send',
							data: {
								from_user_id: this.currentUserId,
								to_user_id: this.otherUserId,
								content: this.inputText
							}
						}
					})
					
					if (res.result.code === 0) {
						this.inputText = ''
						this.loadChatHistory()
					}
				} catch (error) {
					console.error('发送消息失败:', error)
					uni.showToast({
						title: '发送失败',
						icon: 'none'
					})
				}
			},
			scrollToBottom() {
				this.scrollTop = 99999
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.chat-page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f6f8;
		overflow: hidden;
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 32rpx;
		padding-top: calc(20rpx + env(safe-area-inset-top));
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e5e5e5;
		flex-shrink: 0;
	}

	.nav-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.message-list {
		flex: 1;
		padding: 32rpx;
		overflow-y: auto;
		box-sizing: border-box;
		min-height: 0;
	}

	.message-item {
		margin-bottom: 32rpx;
		display: flex;
	}

	.message-item.message-right {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 60%;
		background-color: #ffffff;
		border-radius: 24rpx;
		border-top-left-radius: 0;
		padding: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		word-wrap: break-word;
		word-break: break-all;
	}

	.bubble-right {
		background-color: #14b8a6;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 0;
	}

	.message-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
		word-wrap: break-word;
		word-break: break-all;
	}

	.bubble-right .message-text {
		color: #ffffff;
	}

	.input-bar {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 24rpx 32rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		background-color: #ffffff;
		border-top: 1px solid #e5e5e5;
		flex-shrink: 0;
	}

	.message-input {
		flex: 1;
		background-color: #f5f6f8;
		border: none;
		border-radius: 50rpx;
		padding: 20rpx 32rpx;
		font-size: 28rpx;
	}

	.send-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #ccc;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
	}

	.send-btn-active {
		background-color: #00B4D8 !important;
	}

	.send-btn:active {
		transform: scale(0.95);
	}

	.send-btn-active:active {
		background-color: #0099cc !important;
	}

	.send-btn[disabled] {
		opacity: 0.6;
	}
</style>
