<script>
	import i18n from './utils/i18n.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化语言
			const lang = i18n.getLanguage()
			console.log('Current language:', lang)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
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
	
	/* 主色调 - 橙色 */
	.primary-color {
		color: #FF6B35;
	}
	
	.primary-bg {
		background-color: #FF6B35;
	}
	
	/* 辅助色 - 蓝绿色 */
	.accent-color {
		color: #00B4D8;
	}
	
	.accent-bg {
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
