<template>
	<view class="register-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<uni-icons type="left" size="24" color="#333" @click="goBack"></uni-icons>
			<text class="nav-title">{{ $t('register.title') }}</text>
			<view class="nav-placeholder"></view>
		</view>

		<!-- Logo 和欢迎文字 -->
		<view class="header">
			<image class="logo" src="/static/ArtrisStudent.png" mode="aspectFit"></image>
			<text class="welcome-title">{{ $t('register.createAccount') }}</text>
			<text class="welcome-subtitle">{{ $t('register.subtitle') }}</text>
		</view>

		<!-- 注册表单 -->
		<view class="form-container">
			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="person" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="text" 
						v-model="formData.username" 
						:placeholder="$t('register.usernamePlaceholder')"
						placeholder-style="color: #999"
					/>
				</view>
			</view>

			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="email" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="text" 
						v-model="formData.email" 
						:placeholder="$t('register.emailPlaceholder')"
						placeholder-style="color: #999"
					/>
				</view>
			</view>

			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="password" 
						v-model="formData.password" 
						:placeholder="$t('register.passwordPlaceholder')"
						placeholder-style="color: #999"
					/>
				</view>
			</view>

			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="password" 
						v-model="formData.confirmPassword" 
						:placeholder="$t('register.confirmPasswordPlaceholder')"
						placeholder-style="color: #999"
						@confirm="handleRegister"
					/>
				</view>
			</view>

			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="home" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="text" 
						v-model="formData.school" 
						:placeholder="$t('register.schoolPlaceholder')"
						placeholder-style="color: #999"
					/>
				</view>
			</view>

			<button 
				class="register-btn" 
				:class="{ 'register-btn-disabled': !canRegister }"
				:disabled="!canRegister || loading"
				@click="handleRegister"
			>
				<text v-if="loading">{{ $t('common.loading') }}</text>
				<text v-else>{{ $t('register.registerButton') }}</text>
			</button>

			<view class="login-link" @click="goToLogin">
				<text class="login-text">{{ $t('register.loginLink') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					username: '',
					email: '',
					password: '',
					confirmPassword: '',
					school: ''
				},
				loading: false
			}
		},
		computed: {
			canRegister() {
				return this.formData.username.trim() && 
				       this.formData.email.trim() && 
				       this.formData.password.trim() && 
				       this.formData.confirmPassword.trim() &&
				       this.formData.school.trim()
			}
		},
		methods: {
			validateForm() {
				if (!this.formData.username.trim()) {
					uni.showToast({
						title: '请输入用户名',
						icon: 'none'
					})
					return false
				}

				if (!this.formData.email.trim()) {
					uni.showToast({
						title: '请输入邮箱',
						icon: 'none'
					})
					return false
				}

				// 验证邮箱格式
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				if (!emailRegex.test(this.formData.email)) {
					uni.showToast({
						title: this.$t('register.emailInvalid'),
						icon: 'none'
					})
					return false
				}

				if (!this.formData.password.trim()) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return false
				}

				if (this.formData.password.length < 6) {
					uni.showToast({
						title: this.$t('register.passwordTooShort'),
						icon: 'none'
					})
					return false
				}

				if (this.formData.password !== this.formData.confirmPassword) {
					uni.showToast({
						title: this.$t('register.passwordMismatch'),
						icon: 'none'
					})
					return false
				}

				if (!this.formData.school.trim()) {
					uni.showToast({
						title: '请输入学校名称',
						icon: 'none'
					})
					return false
				}

				return true
			},
			async handleRegister() {
				if (!this.canRegister || this.loading) return

				if (!this.validateForm()) {
					return
				}

				this.loading = true

				try {
					// 使用 uni-id 进行注册
					const uniIdCo = uniCloud.importObject('uni-id-co', {
						customUI: true
					})

					const registerResult = await uniIdCo.register({
						username: this.formData.username,
						email: this.formData.email,
						password: this.formData.password,
						nickname: this.formData.username,
						extend: {
							school: this.formData.school
						}
					})

					if (registerResult.errCode === 0) {
						// 注册成功，直接使用返回的用户信息和 token（不需要再次登录）
						// 保存 token
						if (registerResult.token) {
							uni.setStorageSync('uni_id_token', registerResult.token)
						}
						
						// 保存用户信息
						const userInfo = registerResult.userInfo || {}
						uni.setStorageSync('userInfo', {
							_id: userInfo._id || registerResult.uid,
							username: userInfo.username || this.formData.username,
							email: userInfo.email || this.formData.email,
							avatar: userInfo.avatar_file?.url || '',
							school: userInfo.extend?.school || this.formData.school
						})

						uni.showToast({
							title: this.$t('register.registerSuccess'),
							icon: 'success'
						})

						// 延迟跳转
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/home'
							})
						}, 1500)
					} else {
						throw new Error(registerResult.errMsg || this.$t('register.registerFailed'))
					}
				} catch (error) {
					console.error('注册失败:', error)
					uni.showToast({
						title: error.message || this.$t('register.registerFailed'),
						icon: 'none',
						duration: 2000
					})
				} finally {
					this.loading = false
				}
			},
			goToLogin() {
				uni.navigateBack()
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.register-page {
		min-height: 100vh;
		background-color: #f5f6f8;
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
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.nav-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.nav-placeholder {
		width: 48rpx;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 64rpx 64rpx 48rpx;
		background: linear-gradient(180deg, #00B4D8 0%, transparent 100%);
	}

	.logo {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 32rpx;
	}

	.welcome-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 16rpx;
		text-align: center;
	}

	.welcome-subtitle {
		font-size: 28rpx;
		color: #666;
		text-align: center;
	}

	.form-container {
		background-color: #ffffff;
		border-radius: 48rpx 48rpx 0 0;
		padding: 64rpx 48rpx;
		padding-bottom: calc(64rpx + env(safe-area-inset-bottom));
		margin-top: -48rpx;
		box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
	}

	.form-item {
		margin-bottom: 32rpx;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background-color: #f5f6f8;
		border-radius: 24rpx;
		padding: 24rpx 32rpx;
		gap: 24rpx;
	}

	.input {
		flex: 1;
		font-size: 32rpx;
		color: #333;
	}

	.register-btn {
		width: 100%;
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 180, 216, 0.3);
	}

	.register-btn-disabled {
		background-color: #cccccc;
		box-shadow: none;
	}

	.login-link {
		display: flex;
		justify-content: center;
		margin-top: 32rpx;
	}

	.login-text {
		font-size: 28rpx;
		color: #00B4D8;
	}
</style>
