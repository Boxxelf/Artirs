<template>
	<view class="login-page">
		<!-- Logo 和欢迎文字 -->
		<view class="header">
			<image class="logo" src="/static/ArtrisStudent.png" mode="aspectFit"></image>
			<text class="welcome-title">{{ $t('login.welcome') }}</text>
			<text class="welcome-subtitle">{{ $t('login.subtitle') }}</text>
		</view>

		<!-- 登录表单 -->
		<view class="form-container">
			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="person" size="20" color="#999"></uni-icons>
					<input 
						class="input" 
						type="text" 
						v-model="formData.username" 
						:placeholder="$t('login.usernamePlaceholder')"
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
						:placeholder="$t('login.passwordPlaceholder')"
						placeholder-style="color: #999"
						@confirm="handleLogin"
					/>
				</view>
			</view>

			<view class="forgot-password" @click="handleForgotPassword">
				<text class="forgot-text">{{ $t('login.forgotPassword') }}</text>
			</view>

			<button 
				class="login-btn" 
				:class="{ 'login-btn-disabled': !canLogin }"
				:disabled="!canLogin || loading"
				@click="handleLogin"
			>
				<text v-if="loading">{{ $t('common.loading') }}</text>
				<text v-else>{{ $t('login.loginButton') }}</text>
			</button>

			<view class="register-link" @click="goToRegister">
				<text class="register-text">{{ $t('login.registerLink') }}</text>
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
					password: ''
				},
				loading: false
			}
		},
		computed: {
			canLogin() {
				return this.formData.username.trim() && this.formData.password.trim()
			}
		},
		methods: {
			async handleLogin() {
				if (!this.canLogin || this.loading) return

				// 验证输入
				if (!this.formData.username.trim()) {
					uni.showToast({
						title: this.$t('login.usernameRequired'),
						icon: 'none'
					})
					return
				}

				if (!this.formData.password.trim()) {
					uni.showToast({
						title: this.$t('login.passwordRequired'),
						icon: 'none'
					})
					return
				}

				this.loading = true

				try {
					// 使用 uni-id 进行登录
					const uniIdCo = uniCloud.importObject('uni-id-co', {
						customUI: true
					})

					// 判断是邮箱还是用户名
					const isEmail = this.formData.username.includes('@')
					
					let loginResult
					if (isEmail) {
						// 邮箱登录
						loginResult = await uniIdCo.loginByEmail({
							email: this.formData.username,
							password: this.formData.password
						})
					} else {
						// 用户名登录
						loginResult = await uniIdCo.login({
							username: this.formData.username,
							password: this.formData.password
						})
					}

					if (loginResult.errCode === 0) {
						// 登录成功，获取用户信息
						const userInfo = loginResult.userInfo || {}
						
						// 保存 token（从云对象返回的 token 需要手动保存）
						if (loginResult.token) {
							uni.setStorageSync('uni_id_token', loginResult.token)
						}
						
						// 保存用户信息到本地存储
						uni.setStorageSync('userInfo', {
							_id: userInfo._id || loginResult.uid,
							username: userInfo.username || this.formData.username,
							email: userInfo.email || '',
							avatar: userInfo.avatar_file?.url || '',
							school: userInfo.extend?.school || userInfo.school || 'Rhode Island School of Design'
						})

						uni.showToast({
							title: this.$t('login.loginSuccess'),
							icon: 'success'
						})

						// 延迟跳转，让用户看到成功提示
						setTimeout(() => {
							// 检查是否有返回路径
							const pages = getCurrentPages()
							if (pages.length > 1) {
								// 如果有上一页，返回上一页
								uni.navigateBack()
							} else {
								// 否则跳转到首页
								uni.reLaunch({
									url: '/pages/home/home'
								})
							}
						}, 1500)
					} else {
						throw new Error(loginResult.errMsg || this.$t('login.loginError'))
					}
				} catch (error) {
					console.error('登录失败:', error)
					uni.showToast({
						title: error.message || this.$t('login.loginFailed'),
						icon: 'none',
						duration: 2000
					})
				} finally {
					this.loading = false
				}
			},
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			handleForgotPassword() {
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				})
			}
		}
	}
</script>

<style scoped>
	.login-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #00B4D8 0%, #ffffff 50%);
		padding: 0 64rpx;
		padding-top: calc(120rpx + env(safe-area-inset-top));
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 120rpx;
	}

	.logo {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 48rpx;
	}

	.welcome-title {
		font-size: 56rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 16rpx;
		text-align: center;
	}

	.welcome-subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
	}

	.form-container {
		background-color: #ffffff;
		border-radius: 48rpx 48rpx 0 0;
		padding: 64rpx 48rpx;
		padding-bottom: calc(64rpx + env(safe-area-inset-bottom));
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

	.forgot-password {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 48rpx;
	}

	.forgot-text {
		font-size: 24rpx;
		color: #00B4D8;
	}

	.login-btn {
		width: 100%;
		background-color: #00B4D8;
		color: #ffffff;
		border: none;
		border-radius: 24rpx;
		padding: 32rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 32rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 180, 216, 0.3);
	}

	.login-btn-disabled {
		background-color: #cccccc;
		box-shadow: none;
	}

	.register-link {
		display: flex;
		justify-content: center;
		margin-top: 32rpx;
	}

	.register-text {
		font-size: 28rpx;
		color: #00B4D8;
	}
</style>
