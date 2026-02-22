<template>
	<view class="bottom-nav">
		<view 
			v-for="(item, index) in navList" 
			:key="index"
			class="nav-item"
			:class="{ active: currentPath === item.path }"
			@click="switchTab(item.path)"
		>
			<uni-icons 
				:type="item.icon" 
				:size="24" 
				:color="currentPath === item.path ? '#FF6B35' : '#8a8a8a'"
			></uni-icons>
			<text class="nav-text" :class="{ active: currentPath === item.path }">
				{{ $t(item.textKey) }}
			</text>
		</view>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n.js'
	
	export default {
		name: 'BottomNav',
		data() {
			return {
				currentPath: '',
				navList: [
					{
						path: '/pages/home/home',
						icon: 'home',
						textKey: 'nav.home'
					},
					{
						path: '/pages/schedule/schedule',
						icon: 'calendar',
						textKey: 'nav.schedule'
					},
					{
						path: '/pages/earnings/earnings',
						icon: 'wallet',
						textKey: 'nav.earnings'
					},
					{
						path: '/pages/messages/messages',
						icon: 'chat',
						textKey: 'nav.messages'
					},
					{
						path: '/pages/profile/profile',
						icon: 'contact',
						textKey: 'nav.profile'
					}
				]
			}
		},
		methods: {
			$t(key) {
				return i18n.t(key)
			},
			updateCurrentPath() {
				const pages = getCurrentPages()
				if (pages.length > 0) {
					this.currentPath = '/' + pages[pages.length - 1].route
				}
			},
			switchTab(path) {
				if (this.currentPath !== path) {
					uni.redirectTo({
						url: path
					})
				}
			}
		},
		onLoad() {
			this.updateCurrentPath()
		},
		onShow() {
			this.updateCurrentPath()
		}
	}
</script>

<style scoped>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		padding: 8rpx 0;
		padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
		z-index: 1000;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.nav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4rpx;
		padding: 8rpx 0;
	}
	
	.nav-text {
		font-size: 20rpx;
		color: #8a8a8a;
		font-weight: 500;
	}
	
	.nav-text.active {
		color: #FF6B35;
		font-weight: 600;
	}
</style>
