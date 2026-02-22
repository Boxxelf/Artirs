<template>
	<view class="search-page">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<input 
				class="search-input" 
				v-model="keyword" 
				:placeholder="$t('home.searchPlaceholder')"
				@confirm="doSearch"
				@input="onInput"
			/>
			<button class="search-btn" @click="doSearch">{{ $t('common.search') }}</button>
		</view>

		<!-- 搜索结果 -->
		<view class="search-results">
			<view class="results-header">
				<text class="results-count">{{ $t('search.found', { count: mentors.length }) }}</text>
			</view>
			<view class="mentor-list">
				<view 
					v-for="mentor in mentors" 
					:key="mentor._id"
					class="mentor-item"
					@click="goToMentorDetail(mentor._id)"
				>
					<image class="mentor-avatar" :src="mentor.avatar" mode="aspectFill"></image>
					<view class="mentor-info">
						<text class="mentor-name">{{ mentor.name }}</text>
						<text class="mentor-school">{{ mentor.school }} · {{ mentor.degree }}</text>
						<view class="mentor-footer">
							<text class="mentor-price">¥{{ mentor.price }}/{{ $t('mentor.pricePerSession') }}</text>
							<button class="book-btn" @click.stop="goToBooking(mentor._id)">
								{{ $t('mentor.bookNow') }}
							</button>
						</view>
					</view>
				</view>
			</view>

			<view v-if="loading" class="loading">
				<text>{{ $t('common.loading') }}</text>
			</view>

			<view v-if="!loading && mentors.length === 0 && keyword" class="empty">
				<text>{{ $t('search.noResults') }}</text>
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
				keyword: '',
				mentors: [],
				loading: false
			}
		},
		onLoad(options) {
			if (options.keyword) {
				this.keyword = decodeURIComponent(options.keyword)
				this.doSearch()
			}
		},
		methods: {
			onInput(e) {
				this.keyword = e.detail.value
			},
			async doSearch() {
				if (!this.keyword.trim()) return
				
				this.loading = true
				try {
					const res = await uniCloud.callFunction({
						name: 'mentors',
						data: {
							action: 'getList',
							data: {
								keyword: this.keyword,
								page: 1,
								pageSize: 20
							}
						}
					})
					
					if (res.result.code === 0) {
						this.mentors = res.result.data || []
					}
				} catch (error) {
					console.error('搜索失败:', error)
					uni.showToast({
						title: '搜索失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},
			goToMentorDetail(mentorId) {
				uni.navigateTo({
					url: `/pages/mentor-detail/mentor-detail?id=${mentorId}`
				})
			},
			goToBooking(mentorId) {
				uni.navigateTo({
					url: `/pages/booking/booking?mentorId=${mentorId}`
				})
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.search-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 120rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 24rpx 32rpx;
		background-color: #ffffff;
		border-bottom: 1px solid #e5e5e5;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.search-input {
		flex: 1;
		background-color: #f5f6f8;
		border: none;
		border-radius: 50rpx;
		padding: 16rpx 32rpx;
		font-size: 28rpx;
	}

	.search-btn {
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 50rpx;
		padding: 16rpx 32rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.search-results {
		padding: 32rpx;
	}

	.results-header {
		margin-bottom: 32rpx;
	}

	.results-count {
		font-size: 24rpx;
		color: #999;
	}

	.mentor-list {
	}

	.mentor-item {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		display: flex;
		gap: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.mentor-avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
	}

	.mentor-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.mentor-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.mentor-school {
		font-size: 24rpx;
		color: #999;
	}

	.mentor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16rpx;
	}

	.mentor-price {
		font-size: 32rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.book-btn {
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 50rpx;
		padding: 12rpx 32rpx;
		font-size: 24rpx;
		font-weight: bold;
	}

	.loading, .empty {
		text-align: center;
		padding: 64rpx;
		color: #999;
		font-size: 28rpx;
	}

</style>
