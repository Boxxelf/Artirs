<template>
	<view class="folder-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('folder.title') }}</text>
			<view class="nav-placeholder"></view>
		</view>

		<view class="content">
			<!-- 申请进度卡片 -->
			<view 
				v-for="application in applications" 
				:key="application._id"
				class="application-card"
			>
				<text class="school-name">{{ application.school_name }}</text>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: application.progress + '%' }"></view>
				</view>
				<text class="progress-text">
					{{ $t('folder.processing') }} · {{ $t('folder.daysLeft', { days: getDaysLeft(application.deadline) }) }}
				</text>
			</view>

			<!-- 申请清单 -->
			<view class="materials-section">
				<text class="section-title">{{ $t('folder.applicationList') }}</text>
				<view 
					v-for="(material, index) in materials" 
					:key="index"
					class="material-item"
				>
					<view class="material-info">
						<text class="material-name">{{ material.name }}</text>
						<text class="material-progress">{{ $t('folder.completed', { percent: material.progress }) }}</text>
					</view>
					<uni-icons type="loop" size="24" color="#00B4D8"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				applications: [],
				materials: [
					{ name: '作品集', progress: 80 }
				]
			}
		},
		onLoad() {
			this.loadApplications()
		},
		methods: {
			async loadApplications() {
				try {
					const userInfo = uni.getStorageSync('userInfo') || {}
					const res = await uniCloud.database().collection('applications')
						.where({
							student_id: userInfo._id || 'test_student'
						})
						.get()
					
					if (res.data) {
						this.applications = res.data || []
					}
				} catch (error) {
					console.error('加载申请资料失败:', error)
				}
			},
			getDaysLeft(deadline) {
				if (!deadline) return 0
				const now = new Date()
				const deadlineDate = new Date(deadline)
				const diff = deadlineDate - now
				return Math.ceil(diff / (1000 * 60 * 60 * 24))
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.folder-page {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 32rpx;
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

	.application-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 40rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.school-name {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 24rpx;
	}

	.progress-bar {
		width: 100%;
		height: 10rpx;
		background-color: #f0f0f0;
		border-radius: 50rpx;
		overflow: hidden;
		margin-bottom: 16rpx;
	}

	.progress-fill {
		height: 100%;
		background-color: #00B4D8;
		border-radius: 50rpx;
		transition: width 0.3s;
	}

	.progress-text {
		font-size: 24rpx;
		color: #999;
	}

	.materials-section {
		margin-top: 48rpx;
	}

	.section-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 24rpx;
	}

	.material-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
	}

	.material-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.material-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.material-progress {
		font-size: 24rpx;
		color: #999;
	}
</style>
