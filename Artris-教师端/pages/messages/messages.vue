<template>
	<view class="messages-page">
		<Header :title="$t('messages.title')"></Header>
		
		<view class="content">
			<view class="empty-state">
				<text class="empty-text">{{ $t('messages.developing') }}</text>
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
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			}
		}
	}
</script>

<style scoped>
	.messages-page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 32rpx;
	}
	
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
</style>
