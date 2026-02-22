'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	console.log('success_cases 云函数收到请求:', JSON.stringify(event))
	
	const { action, data } = event
	
	try {
		if (!action) {
			return {
				code: -1,
				message: '缺少 action 参数',
				data: []
			}
		}
		
		switch (action) {
			case 'getList':
				// 获取成功案例列表
				const { limit = 10 } = data || {}
				
				console.log('开始查询成功案例，limit:', limit)
				
				// 使用 JQL 方式查询
				const result = await db.collection('success_cases')
					.orderBy('create_date', 'desc')
					.limit(parseInt(limit))
					.get()
				
				console.log('查询结果:', result)
				
				return {
					code: 0,
					data: result.data || [],
					message: 'success'
				}
			
			default:
				return {
					code: -1,
					message: '未知操作: ' + action,
					data: []
				}
		}
	} catch (error) {
		console.error('success_cases 云函数错误:', error)
		console.error('错误堆栈:', error.stack)
		return {
			code: -1,
			message: error.message || '查询失败',
			data: []
		}
	}
}
