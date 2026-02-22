'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const { action, data } = event
	
	try {
		switch (action) {
			case 'getList':
				// 获取导师列表
				const { category, page = 1, pageSize = 10, keyword } = data || {}
				let query = db.collection('mentors')
				
				if (category && category !== 'all') {
					query = query.where({
						category: category
					})
				}
				
				if (keyword) {
					query = query.where({
						name: new RegExp(keyword, 'i')
					})
				}
				
				const result = await query
					.orderBy('rating', 'desc')
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.get()
				
				return {
					code: 0,
					data: result.data,
					message: 'success'
				}
			
			case 'getDetail':
				// 获取导师详情
				const { mentorId } = data
				if (!mentorId) {
					return {
						code: -1,
						message: '缺少导师ID'
					}
				}
				
				const mentor = await db.collection('mentors').doc(mentorId).get()
				
				if (mentor.data.length === 0) {
					return {
						code: -1,
						message: '导师不存在'
					}
				}
				
				return {
					code: 0,
					data: mentor.data[0],
					message: 'success'
				}
			
			case 'getFeatured':
				// 获取精选导师
				const featured = await db.collection('mentors')
					.where({
						rating: db.command.gte(4.5)
					})
					.orderBy('rating', 'desc')
					.limit(10)
					.get()
				
				return {
					code: 0,
					data: featured.data,
					message: 'success'
				}
			
			default:
				return {
					code: -1,
					message: '未知操作'
				}
		}
	} catch (error) {
		return {
			code: -1,
			message: error.message
		}
	}
}
