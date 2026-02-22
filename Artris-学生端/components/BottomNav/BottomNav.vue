<template>
	<view class="bottom-nav">
		<view 
			v-for="(item, index) in navList" 
			:key="index"
			class="nav-item"
			:class="{ active: currentPath === item.path }"
			@click="switchTab(item.path)"
		>
			<text class="nav-icon" :class="{ active: currentPath === item.path }">
				{{ item.icon }}
			</text>
			<text class="nav-text" :class="{ active: currentPath === item.path }">
				{{ $t(item.textKey) }}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'BottomNav',
		data() {
			return {
				currentPath: '',
				navList: [
					{
						path: '/pages/home/home',
						icon: '●',
						textKey: 'nav.home'
					},
					{
						path: '/pages/mentors/mentors',
						icon: '○',
						textKey: 'nav.mentors'
					},
					{
						path: '/pages/appointments/appointments',
						icon: '◐',
						textKey: 'nav.appointments'
					},
					{
						path: '/pages/messages/messages',
						icon: '◑',
						textKey: 'nav.messages'
					},
					{
						path: '/pages/profile/profile',
						icon: '◉',
						textKey: 'nav.profile'
					}
				]
			}
		},
		onLoad() {
			this.updateCurrentPath()
		},
		onShow() {
			this.updateCurrentPath()
		},
		methods: {
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
	
	.nav-icon {
		font-size: 36rpx;
		line-height: 1;
		color: #8a8a8a;
		font-weight: normal;
		transition: all 0.3s;
	}
	
	.nav-icon.active {
		color: #00B4D8;
		font-weight: bold;
		transform: scale(1.15);
	}
	
	.nav-text {
		font-size: 20rpx;
		color: #8a8a8a;
		font-weight: 500;
	}
	
	.nav-text.active {
		color: #00B4D8;
		font-weight: 600;
	}
</style>
