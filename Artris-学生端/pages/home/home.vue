<template>
	<view class="home-page">
		<!-- 头部 -->
		<view class="header">
			<view class="header-top">
				<image class="logo" src="/static/ArtrisStudent.png" mode="aspectFit"></image>
				<view class="header-right">
					<uni-icons type="bell" size="24" color="#333" @click="handleNotification"></uni-icons>
				</view>
			</view>
			<view class="search-box" @click="goToSearch">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<text class="search-placeholder">{{ $t('home.searchPlaceholder') }}</text>
			</view>
		</view>

		<!-- 轮播图/主视觉 -->
		<view class="hero-section">
			<view class="hero-content">
				<text class="hero-title">{{ $t('home.heroTitle') }}</text>
				<text class="hero-subtitle">{{ $t('home.heroSubtitle') }}</text>
				<button class="explore-btn" @click="handleExplore">{{ $t('home.exploreNow') }}</button>
			</view>
		</view>

		<!-- 分类标签 -->
		<view class="categories">
			<scroll-view class="category-scroll" scroll-x="true" :show-scrollbar="false">
				<view 
					v-for="(cat, index) in categories" 
					:key="index"
					class="category-item"
					:class="{ active: selectedCategory === cat.value }"
					@click="selectCategory(cat.value)"
				>
					{{ $t(cat.label) }}
				</view>
			</scroll-view>
		</view>

		<!-- 精选导师 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">{{ $t('home.featuredMentors') }}</text>
				<view class="section-more" @click="goToMentors">
					<text>{{ $t('home.allMentors') }}</text>
					<uni-icons type="right" size="14" color="#00B4D8"></uni-icons>
				</view>
			</view>
			<scroll-view class="mentor-scroll" scroll-x="true" :show-scrollbar="false">
				<view 
					v-for="mentor in featuredMentors" 
					:key="mentor._id"
					class="mentor-card"
					@click="goToMentorDetail(mentor._id)"
				>
					<view class="mentor-header">
						<image class="mentor-avatar" :src="mentor.avatar" mode="aspectFill"></image>
						<view class="mentor-info">
							<text class="mentor-name">{{ mentor.name }}</text>
							<view class="mentor-badge">{{ mentor.school }} {{ mentor.degree }}</view>
						</view>
					</view>
					<text class="mentor-desc">{{ mentor.specialties?.join(' | ') || '' }} | {{ mentor.experience }}{{ $t('mentor.yearsExperience') }}</text>
					<view class="mentor-footer">
						<view class="mentor-rating">
							<uni-icons type="star-filled" size="14" color="#FFA500"></uni-icons>
							<text class="rating-text">{{ mentor.rating }}</text>
						</view>
						<view class="mentor-price">
							<text class="price-symbol">¥</text>
							<text class="price-value">{{ mentor.price }}</text>
							<text class="price-unit">/{{ $t('mentor.pricePerSession') }}</text>
						</view>
					</view>
					<button class="book-btn" @click.stop="goToBooking(mentor._id)">{{ $t('mentor.bookNow') }}</button>
				</view>
			</scroll-view>
		</view>

		<!-- 成功案例 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">{{ $t('home.successCases') }}</text>
				<view class="section-more">
					<text>{{ $t('home.moreAdmissions') }}</text>
					<uni-icons type="right" size="14" color="#00B4D8"></uni-icons>
				</view>
			</view>
			<view class="success-cases">
				<view 
					v-for="(caseItem, index) in successCases" 
					:key="index"
					class="case-card"
				>
					<image class="case-image" :src="caseItem.image" mode="aspectFill"></image>
					<view class="case-overlay"></view>
					<view class="case-info">
						<view class="case-badge">{{ $t('home.moreAdmissions') }} {{ caseItem.school }} {{ caseItem.degree }}</view>
						<text class="case-name">{{ caseItem.student_name }}</text>
					</view>
				</view>
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
				selectedCategory: 'all',
				categories: [
					{ value: 'all', label: 'home.categories.all' },
					{ value: 'illustration', label: 'home.categories.illustration' },
					{ value: 'product', label: 'home.categories.product' },
					{ value: 'architecture', label: 'home.categories.architecture' }
				],
				featuredMentors: [],
				successCases: [],
				loading: false
			}
		},
		onLoad() {
			this.loadData()
		},
		onShow() {
			// 刷新数据
			this.loadData()
		},
		methods: {
			async loadData() {
				this.loading = true
				try {
					// 加载精选导师
					const mentorsRes = await uniCloud.callFunction({
						name: 'mentors',
						data: {
							action: 'getFeatured'
						}
					})
					
					if (mentorsRes.result.code === 0) {
						this.featuredMentors = mentorsRes.result.data || []
					}
					
					// 加载成功案例 - 先尝试使用云函数，失败则使用直接查询
					try {
						// 尝试使用云函数
						const casesRes = await uniCloud.callFunction({
							name: 'success_cases',
							data: {
								action: 'getList',
								data: {
									limit: 4
								}
							}
						})
						
						console.log('成功案例查询结果:', casesRes)
						
						if (casesRes && casesRes.result) {
							if (casesRes.result.code === 0 && Array.isArray(casesRes.result.data)) {
								this.successCases = casesRes.result.data
								console.log('成功案例数据:', this.successCases)
							} else {
								console.log('成功案例查询返回异常:', casesRes.result)
								this.successCases = []
							}
						} else {
							console.log('成功案例查询结果格式异常:', casesRes)
							this.successCases = []
						}
					} catch (caseError) {
						console.warn('云函数调用失败，尝试直接查询数据库:', caseError.message)
						
						// 如果云函数调用失败，尝试直接查询数据库（仅用于开发测试）
						try {
							const db = uniCloud.database()
							const directRes = await db.collection('success_cases')
								.orderBy('create_date', 'desc')
								.limit(4)
								.get()
							
							if (directRes && directRes.data && directRes.data.length > 0) {
								this.successCases = directRes.data
								console.log('直接查询成功，获取到数据:', this.successCases.length, '条')
							} else {
								this.successCases = []
							}
						} catch (directError) {
							console.error('直接查询也失败:', directError)
							this.successCases = []
						}
					}
				} catch (error) {
					console.error('加载数据失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},
			selectCategory(value) {
				this.selectedCategory = value
				// 可以在这里重新加载数据
			},
			goToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			goToMentors() {
				uni.redirectTo({
					url: '/pages/mentors/mentors'
				})
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
			handleExplore() {
				this.goToMentors()
			},
			handleNotification() {
				// 处理通知
			}
		}
	}
</script>

<style scoped>
	.home-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 120rpx;
	}

	.header {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		padding: 20rpx 32rpx;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.logo {
		height: 60rpx;
		width: 200rpx;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 16rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 20rpx 24rpx;
	}

	.search-placeholder {
		font-size: 28rpx;
		color: #999;
	}

	.hero-section {
		margin: 24rpx 32rpx;
		background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%);
		border-radius: 24rpx;
		padding: 64rpx 48rpx;
		position: relative;
		overflow: hidden;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 60%;
	}

	.hero-title {
		display: block;
		font-size: 56rpx;
		font-weight: bold;
		color: #ffffff;
		line-height: 1.4;
		margin-bottom: 16rpx;
		white-space: pre-line;
	}

	.hero-subtitle {
		display: block;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 32rpx;
		line-height: 1.5;
	}

	.explore-btn {
		background-color: #ffffff;
		color: #00B4D8;
		border: none;
		border-radius: 50rpx;
		padding: 16rpx 48rpx;
		font-size: 28rpx;
		font-weight: 600;
	}

	.categories {
		margin: 32rpx 0;
		padding: 0 32rpx;
	}

	.category-scroll {
		white-space: nowrap;
	}

	.category-item {
		display: inline-block;
		padding: 16rpx 48rpx;
		margin-right: 24rpx;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 50rpx;
		font-size: 28rpx;
		color: #666;
	}

	.category-item.active {
		background-color: #00B4D8;
		color: #ffffff;
		border-color: #00B4D8;
	}

	.section {
		margin: 48rpx 0;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		margin-bottom: 24rpx;
	}

	.section-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.section-more {
		display: flex;
		align-items: center;
		gap: 8rpx;
		color: #00B4D8;
		font-size: 28rpx;
	}

	.mentor-scroll {
		white-space: nowrap;
		padding: 0 32rpx;
	}

	.mentor-card {
		display: inline-block;
		width: 576rpx;
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-radius: 24rpx;
		padding: 40rpx;
		margin-right: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.mentor-header {
		display: flex;
		align-items: center;
		gap: 32rpx;
		margin-bottom: 24rpx;
	}

	.mentor-avatar {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		border: 4rpx solid #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.mentor-info {
		flex: 1;
	}

	.mentor-name {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}

	.mentor-badge {
		display: inline-block;
		background-color: #f0f0f0;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: bold;
		color: #666;
		text-transform: uppercase;
	}

	.mentor-desc {
		display: block;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 32rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mentor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
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

	.price-symbol {
		font-size: 28rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.price-value {
		font-size: 36rpx;
		font-weight: bold;
		color: #00B4D8;
	}

	.price-unit {
		font-size: 24rpx;
		color: #999;
	}

	.book-btn {
		width: 100%;
		background-color: #2dd4bf;
		color: #ffffff;
		border: none;
		border-radius: 16rpx;
		padding: 20rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.success-cases {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 32rpx;
		padding: 0 32rpx;
	}

	.case-card {
		position: relative;
		border-radius: 24rpx;
		overflow: hidden;
		background-color: #ffffff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.case-image {
		width: 100%;
		aspect-ratio: 4/5;
		object-fit: cover;
	}

	.case-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
	}

	.case-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 32rpx;
	}

	.case-badge {
		display: inline-block;
		background-color: #2dd4bf;
		color: #ffffff;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.case-name {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #ffffff;
	}

</style>
