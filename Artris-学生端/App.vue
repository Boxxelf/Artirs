<script>
	import i18n from './utils/i18n.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化语言
			const lang = i18n.getLanguage()
			console.log('Current language:', lang)
			
			// 检查用户登录状态
			this.checkLoginStatus()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			async checkLoginStatus() {
				try {
					// 检查是否有 uniIdToken
					const uniIdToken = uni.getStorageSync('uni_id_token')
					if (!uniIdToken) {
						// 没有 token，检查是否有用户信息
						const userInfo = uni.getStorageSync('userInfo')
						if (!userInfo || !userInfo._id) {
							// 没有用户信息，清除可能存在的旧数据
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('uni_id_token')
							return
						}
					}
					
					// 尝试获取当前用户信息验证 token 是否有效
					try {
						const uniIdCo = uniCloud.importObject('uni-id-co', {
							customUI: true
						})
						const userInfo = await uniIdCo.checkToken()
						
						if (userInfo.errCode === 0 && userInfo.userInfo) {
							// token 有效，更新用户信息
							const user = userInfo.userInfo
							uni.setStorageSync('userInfo', {
								_id: user._id,
								username: user.username || '',
								email: user.email || '',
								avatar: user.avatar_file?.url || '',
								school: user.extend?.school || user.school || 'Rhode Island School of Design'
							})
						} else {
							// token 无效，清除登录信息
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('uni_id_token')
						}
					} catch (error) {
						console.error('检查登录状态失败:', error)
						// 如果检查失败，不清除数据，可能是网络问题
					}
				} catch (error) {
					console.error('检查登录状态出错:', error)
				}
			}
		},
		globalData: {
			i18n: i18n
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #f5f6f8;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}
	
	/* 主色调 */
	.primary-color {
		color: #00B4D8;
	}
	
	.primary-bg {
		background-color: #00B4D8;
	}
	
	/* 玻璃效果 */
	.glass-card {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
	
	/* 隐藏滚动条 */
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
