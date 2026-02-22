<template>
	<view class="earnings-page">
		<Header :title="$t('earnings.title')" :showBack="true" rightIcon="eye" @rightClick="toggleVisibility"></Header>
		
		<view class="content">
			<!-- 总余额卡片 -->
			<view class="balance-card primary-bg">
				<view class="balance-header">
					<text class="balance-label">{{ $t('earnings.totalBalance') }}</text>
					<uni-icons type="wallet" size="24" color="rgba(255,255,255,0.5)"></uni-icons>
				</view>
				<view class="balance-amount">
					<text class="currency">¥</text>
					<text class="amount">12,850.00</text>
				</view>
				<view class="balance-actions">
					<button class="withdraw-btn" @click="handleWithdraw">{{ $t('earnings.withdraw') }}</button>
					<button class="settings-btn" @click="handleSettings">
						<uni-icons type="settings" size="20" color="#fff"></uni-icons>
					</button>
				</view>
			</view>
			
			<!-- 收入图表 -->
			<view class="chart-section glass-card">
				<view class="chart-header">
					<view>
						<text class="chart-title">{{ $t('earnings.incomeOverview') }}</text>
						<text class="chart-subtitle">{{ $t('earnings.growth') }} <text class="growth-text">+12.5%</text></text>
					</view>
					<view class="year-badge">
						<text class="year-text">2024</text>
					</view>
				</view>
				<view class="chart-container">
					<view class="chart-bars">
						<view 
							v-for="(item, index) in chartData" 
							:key="index"
							class="chart-bar-item"
						>
							<view class="bar-container">
								<view class="bar" :style="{ height: item.height }">
									<view class="bar-value">{{ item.value }}</view>
								</view>
							</view>
							<text class="bar-label">{{ item.month }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 收入明细 -->
			<view class="details-section">
				<view class="section-header">
					<text class="section-title">{{ $t('earnings.incomeDetails') }}</text>
					<text class="view-all" @click="viewAllDetails">{{ $t('earnings.viewAll') }}</text>
				</view>
				<view class="details-list glass-card">
					<view 
						v-for="(item, index) in incomeDetails" 
						:key="index"
						class="detail-item"
					>
						<view class="detail-left">
							<view class="detail-icon accent-bg">
								<uni-icons type="person" size="20" color="#fff"></uni-icons>
							</view>
							<view class="detail-info">
								<text class="detail-name">{{ item.name }}</text>
								<text class="detail-time">{{ item.time }}</text>
							</view>
						</view>
						<view class="detail-right">
							<text class="detail-amount primary-color">+{{ item.amount }}</text>
							<text class="detail-course">{{ item.course }}</text>
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
				chartData: [
					{ month: '1月', height: '65%', value: '¥5.2k' },
					{ month: '2月', height: '85%', value: '¥7.1k' },
					{ month: '3月', height: '60%', value: '¥4.8k' },
					{ month: '4月', height: '75%', value: '¥6.2k' },
					{ month: '5月', height: '100%', value: '¥8.5k' },
					{ month: '6月', height: '45%', value: '¥3.9k' }
				],
				incomeDetails: [
					{ name: '李明华', time: '2024-06-12 14:30', amount: '¥500.00', course: '写生基础课' },
					{ name: '王小丫', time: '2024-06-11 09:00', amount: '¥320.00', course: '色彩理论进阶' },
					{ name: '陈志强', time: '2024-06-10 18:15', amount: '¥800.00', course: '1对1私教课' }
				]
			}
		},
		methods: {
			$t(key, params) {
				return i18n.t(key, params)
			},
			toggleVisibility() {
				// 切换可见性
			},
			handleWithdraw() {
				// 提现逻辑
			},
			handleSettings() {
				// 设置逻辑
			},
			viewAllDetails() {
				// 查看全部明细
			}
		}
	}
</script>

<style scoped>
	.earnings-page {
		min-height: 100vh;
		padding-bottom: 200rpx;
		background-color: #f5f6f8;
	}
	
	.content {
		padding: 32rpx;
	}
	
	.balance-card {
		padding: 48rpx;
		border-radius: 24rpx;
		margin-bottom: 32rpx;
		position: relative;
		overflow: hidden;
	}
	
	.balance-card::after {
		content: '';
		position: absolute;
		right: -80rpx;
		bottom: -80rpx;
		width: 320rpx;
		height: 320rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		filter: blur(60rpx);
	}
	
	.balance-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}
	
	.balance-label {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
	}
	
	.balance-amount {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin-bottom: 48rpx;
	}
	
	.currency {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}
	
	.amount {
		font-size: 80rpx;
		font-weight: bold;
		color: #fff;
		letter-spacing: -2rpx;
	}
	
	.balance-actions {
		display: flex;
		gap: 24rpx;
	}
	
	.withdraw-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		padding: 24rpx;
		background-color: #fff;
		color: #FF6B35;
		border-radius: 16rpx;
		border: none;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.settings-btn {
		width: 96rpx;
		height: 96rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 16rpx;
		border: none;
	}
	
	.chart-section {
		padding: 40rpx;
		border-radius: 24rpx;
		margin-bottom: 32rpx;
	}
	
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 48rpx;
	}
	
	.chart-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
	}
	
	.chart-subtitle {
		font-size: 24rpx;
		color: #999;
	}
	
	.growth-text {
		color: #00B4D8;
		font-weight: bold;
	}
	
	.year-badge {
		padding: 8rpx 24rpx;
		background-color: #f0f0f0;
		border-radius: 48rpx;
	}
	
	.year-text {
		font-size: 24rpx;
		font-weight: 500;
		color: #666;
	}
	
	.chart-container {
		height: 320rpx;
	}
	
	.chart-bars {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		height: 100%;
		gap: 16rpx;
	}
	
	.chart-bar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		height: 100%;
	}
	
	.bar-container {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: flex-end;
		position: relative;
	}
	
	.bar {
		width: 100%;
		background-color: #FF6B35;
		border-radius: 8rpx 8rpx 0 0;
		position: relative;
		transition: all 0.5s;
	}
	
	.bar-value {
		position: absolute;
		top: -48rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 20rpx;
		color: #333;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.3s;
	}
	
	.bar-container:hover .bar-value {
		opacity: 1;
	}
	
	.bar-label {
		font-size: 20rpx;
		color: #999;
		font-weight: 500;
	}
	
	.details-section {
		margin-top: 32rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.view-all {
		font-size: 28rpx;
		color: #FF6B35;
		font-weight: 600;
	}
	
	.details-list {
		border-radius: 24rpx;
		overflow: hidden;
	}
	
	.detail-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}
	
	.detail-item:last-child {
		border-bottom: none;
	}
	
	.detail-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
		flex: 1;
	}
	
	.detail-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.detail-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.detail-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.detail-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.detail-right {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}
	
	.detail-amount {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.detail-course {
		font-size: 20rpx;
		color: #999;
	}
</style>
