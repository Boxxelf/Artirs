<template>
	<view class="mentors-page">
		<!-- 头部 -->
		<view class="header">
			<view class="header-content">
				<uni-icons type="home" size="24" color="#00B4D8"></uni-icons>
				<text class="header-title">{{ $t('mentor.title') }}</text>
			</view>
			<view class="header-right" @click="goToSearch">
				<uni-icons type="search" size="24" color="#666"></uni-icons>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="filter-bar">
			<scroll-view class="filter-scroll" scroll-x="true" :show-scrollbar="false">
				<view class="filter-item" @click="showPriceFilter">
					<text>{{ $t('common.filter') || '按价格' }}</text>
					<uni-icons type="down" size="14" color="#666"></uni-icons>
				</view>
			</scroll-view>
		</view>

		<!-- 导师列表 -->
		<view class="mentor-list">
			<view 
				v-for="mentor in mentors" 
				:key="mentor._id"
				class="mentor-item"
				@click="goToMentorDetail(mentor._id)"
			>
				<view class="mentor-card">
					<view class="mentor-main">
						<image class="mentor-avatar" :src="mentor.avatar" mode="aspectFill"></image>
						<view class="mentor-info">
							<view class="mentor-header">
								<text class="mentor-name">{{ mentor.name }}</text>
								<view v-if="mentor.available" class="available-badge">
									{{ $t('mentor.availableThisWeek') }}
								</view>
							</view>
							<text class="mentor-school">{{ mentor.school }}</text>
							<text class="mentor-exp">{{ mentor.degree }}</text>
						</view>
					</view>
					<view class="mentor-footer">
						<view class="mentor-rating">
							<uni-icons type="star-filled" size="18" color="#FFA500"></uni-icons>
							<text class="rating-text">{{ mentor.rating }}</text>
						</view>
						<view class="mentor-price">
							<text class="price-value">¥{{ mentor.price }}</text>
							<text class="price-unit">/{{ $t('mentor.pricePerHour') }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="loading" class="loading">
				<text>{{ $t('common.loading') }}</text>
			</view>
			
			<view v-if="!loading && mentors.length === 0" class="empty">
				<text>{{ $t('common.noData') }}</text>
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
				mentors: [],
				loading: false,
				page: 1,
				pageSize: 10,
				hasMore: true
			}
		},
		onLoad() {
			this.loadMentors()
		},
		onReachBottom() {
			if (this.hasMore && !this.loading) {
				this.loadMore()
			}
		},
		methods: {
			async loadMentors() {
				this.loading = true
				try {
					const res = await uniCloud.callFunction({
						name: 'mentors',
						data: {
							action: 'getList',
							data: {
								page: this.page,
								pageSize: this.pageSize
							}
						}
					})
					
					if (res.result.code === 0) {
						if (this.page === 1) {
							this.mentors = res.result.data || []
						} else {
							this.mentors = [...this.mentors, ...(res.result.data || [])]
						}
						this.hasMore = res.result.data.length === this.pageSize
					}
				} catch (error) {
					console.error('加载导师失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},
			loadMore() {
				this.page++
				this.loadMentors()
			},
			goToMentorDetail(mentorId) {
				uni.navigateTo({
					url: `/pages/mentor-detail/mentor-detail?id=${mentorId}`
				})
			},
			goToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			showPriceFilter() {
				// 显示价格筛选
			}
		}
	}
</script>

<style scoped>
	.mentors-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 120rpx;
	}

	.header {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		padding: 24rpx 32rpx;
		border-bottom: 1px solid #e5e5e5;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.header-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.header-right {
		position: absolute;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.filter-bar {
		background-color: #ffffff;
		padding: 16rpx 32rpx;
		border-bottom: 1px solid #e5e5e5;
	}

	.filter-scroll {
		white-space: nowrap;
	}

	.filter-item {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 16rpx 32rpx;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 50rpx;
		font-size: 28rpx;
		color: #666;
		margin-right: 16rpx;
	}

	.mentor-list {
		padding: 32rpx;
	}

	.mentor-item {
		margin-bottom: 32rpx;
	}

	.mentor-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 24rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.mentor-main {
		display: flex;
		gap: 32rpx;
		margin-bottom: 24rpx;
	}

	.mentor-avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.mentor-info {
		flex: 1;
	}

	.mentor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.mentor-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.available-badge {
		background-color: #4CAF50;
		color: #ffffff;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: bold;
	}

	.mentor-school {
		display: block;
		font-size: 28rpx;
		color: #666;
		font-weight: 500;
		margin-bottom: 8rpx;
	}

	.mentor-exp {
		display: block;
		font-size: 24rpx;
		color: #999;
	}

	.mentor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 24rpx;
		border-top: 1px solid rgba(0, 0, 0, 0.05);
	}

	.mentor-rating {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.rating-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #FFA500;
	}

	.mentor-price {
		display: flex;
		align-items: baseline;
	}

	.price-value {
		font-size: 40rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.price-unit {
		font-size: 24rpx;
		color: #999;
		margin-left: 4rpx;
	}

	.loading, .empty {
		text-align: center;
		padding: 64rpx;
		color: #999;
		font-size: 28rpx;
	}

</style>
