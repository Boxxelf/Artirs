'use strict';

// 教师端共享学生端的 orders 云对象
// 如果两个项目使用同一个 uniCloud 空间，则不需要此文件
// 如果使用不同的空间，需要复制学生端的云对象代码

const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
	_before: function() {
		// 前置操作：验证用户是否登录（可选，某些方法可能不需要）
	},
	
	/**
	 * 获取当前用户ID（从 token 中）
	 */
	async getCurrentUserId() {
		const token = this.getUniIdToken()
		if (!token) {
			return null
		}
		
		try {
			const tokenRes = await db.collection('tokens')
				.where({
					token: token
				})
				.get()
			
			if (tokenRes.data.length === 0) {
				return null
			}
			
			const tokenData = tokenRes.data[0]
			
			// 检查是否过期
			if (new Date() > new Date(tokenData.expire_date)) {
				return null
			}
			
			return tokenData.user_id
		} catch (error) {
			console.error('获取用户ID失败:', error)
			return null
		}
	},
	
	/**
	 * 创建订单
	 * @param {Object} data - 订单数据
	 */
	async create(data) {
		const uid = await this.getCurrentUserId()
		
		if (!uid) {
			return {
				code: -1,
				message: '用户未登录，无法创建订单'
			}
		}
		
		// 验证必填字段
		if (!data.mentor_id || !data.appointment_date || !data.appointment_time || !data.total_amount) {
			return {
				code: -1,
				message: '缺少必填字段：mentor_id, appointment_date, appointment_time, total_amount'
			}
		}
		
		// 生成订单号
		const orderNo = this.generateOrderNo()
		
		// 构建订单数据
		const orderData = {
			order_no: orderNo,
			student_id: uid,
			mentor_id: data.mentor_id,
			appointment_date: data.appointment_date,
			appointment_time: data.appointment_time,
			duration: data.duration || 60,
			course_name: data.course_name || '作品集指导',
			price: data.price || 0,
			discount: data.discount || 0,
			total_amount: data.total_amount,
			status: 'pending',
			create_date: new Date(),
			update_date: new Date()
		}
		
		try {
			const createResult = await db.collection('orders').add(orderData)
			
			return {
				code: 0,
				data: {
					order_id: createResult.id,
					order_no: orderNo
				},
				message: '订单创建成功'
			}
		} catch (error) {
			console.error('创建订单失败:', error)
			return {
				code: -1,
				message: error.message || '创建订单失败'
			}
		}
	},
	
	/**
	 * 获取订单列表
	 * @param {Object} params - 查询参数
	 */
	async getList(params = {}) {
		const uid = await this.getCurrentUserId()
		
		if (!uid) {
			return {
				code: -1,
				message: '用户未登录',
				data: []
			}
		}
		
		const { role = 'mentor', status, page = 1, pageSize = 10 } = params
		
		try {
			let query = db.collection('orders')
			
			// 根据角色筛选
			if (role === 'student') {
				query = query.where({
					student_id: uid
				})
			} else if (role === 'mentor') {
				query = query.where({
					mentor_id: uid
				})
			} else {
				query = query.where(
					dbCmd.or([
						{ student_id: uid },
						{ mentor_id: uid }
					])
				)
			}
			
			// 状态筛选
			if (status) {
				query = query.where({
					status: status
				})
			}
			
			// 查询订单
			const orders = await query
				.orderBy('create_date', 'desc')
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.get()
			
			// 获取导师信息
			const mentorIds = [...new Set(orders.data.map(o => o.mentor_id))]
			const mentors = await db.collection('mentors')
				.where({
					_id: dbCmd.in(mentorIds)
				})
				.get()
			
			const mentorMap = {}
			mentors.data.forEach(m => {
				mentorMap[m._id] = m
			})
			
			// 获取学生信息
			const studentIds = [...new Set(orders.data.map(o => o.student_id))]
			const students = await db.collection('users')
				.where({
					_id: dbCmd.in(studentIds)
				})
				.field({
					_id: true,
					username: true,
					avatar_file: true
				})
				.get()
			
			const studentMap = {}
			students.data.forEach(s => {
				studentMap[s._id] = s
			})
			
			// 组装结果
			const result = orders.data.map(order => {
				return {
					...order,
					mentor: mentorMap[order.mentor_id] || null,
					student: studentMap[order.student_id] || null
				}
			})
			
			return {
				code: 0,
				data: result,
				message: 'success'
			}
		} catch (error) {
			console.error('获取订单列表失败:', error)
			return {
				code: -1,
				message: error.message || '获取订单列表失败',
				data: []
			}
		}
	},
	
	/**
	 * 获取订单详情
	 * @param {String} orderId - 订单ID
	 */
	async getDetail(orderId) {
		const uid = await this.getCurrentUserId()
		
		if (!uid) {
			return {
				code: -1,
				message: '用户未登录'
			}
		}
		
		if (!orderId) {
			return {
				code: -1,
				message: '缺少订单ID'
			}
		}
		
		try {
			const order = await db.collection('orders').doc(orderId).get()
			
			if (order.data.length === 0) {
				return {
					code: -1,
					message: '订单不存在'
				}
			}
			
			const orderData = order.data[0]
			
			// 验证权限
			if (orderData.student_id !== uid && orderData.mentor_id !== uid) {
				return {
					code: -1,
					message: '无权限查看此订单'
				}
			}
			
			// 获取导师信息
			const mentorInfo = await db.collection('mentors').doc(orderData.mentor_id).get()
			
			// 获取学生信息
			const studentInfo = await db.collection('users')
				.doc(orderData.student_id)
				.field({
					_id: true,
					username: true,
					avatar_file: true,
					email: true
				})
				.get()
			
			return {
				code: 0,
				data: {
					...orderData,
					mentor: mentorInfo.data[0] || null,
					student: studentInfo.data[0] || null
				},
				message: 'success'
			}
		} catch (error) {
			console.error('获取订单详情失败:', error)
			return {
				code: -1,
				message: error.message || '获取订单详情失败'
			}
		}
	},
	
	/**
	 * 更新订单状态（导师确认订单）
	 * @param {String} orderId - 订单ID
	 * @param {String} status - 新状态
	 * @param {Object} zoomData - Zoom会议信息（可选）
	 */
	async updateStatus(orderId, status, zoomData = {}) {
		const uid = await this.getCurrentUserId()
		
		if (!uid) {
			return {
				code: -1,
				message: '用户未登录'
			}
		}
		
		if (!orderId || !status) {
			return {
				code: -1,
				message: '缺少订单ID或状态'
			}
		}
		
		// 验证状态值
		const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
		if (!validStatuses.includes(status)) {
			return {
				code: -1,
				message: '无效的订单状态'
			}
		}
		
		try {
			// 获取订单信息
			const order = await db.collection('orders').doc(orderId).get()
			
			if (order.data.length === 0) {
				return {
					code: -1,
					message: '订单不存在'
				}
			}
			
			const orderData = order.data[0]
			
			// 权限验证
			if (status === 'confirmed' && orderData.mentor_id !== uid) {
				return {
					code: -1,
					message: '只有导师可以确认订单'
				}
			}
			
			if (status === 'cancelled' && orderData.student_id !== uid && orderData.mentor_id !== uid) {
				return {
					code: -1,
					message: '无权限取消此订单'
				}
			}
			
			// 构建更新数据
			const updateData = {
				status: status,
				update_date: new Date()
			}
			
			// 如果提供了 Zoom 信息，添加到更新数据中
			if (zoomData.zoom_meeting_id) {
				updateData.zoom_meeting_id = zoomData.zoom_meeting_id
			}
			if (zoomData.zoom_join_url) {
				updateData.zoom_join_url = zoomData.zoom_join_url
			}
			
			// 更新订单
			await db.collection('orders').doc(orderId).update(updateData)
			
			return {
				code: 0,
				message: '订单状态更新成功'
			}
		} catch (error) {
			console.error('更新订单状态失败:', error)
			return {
				code: -1,
				message: error.message || '更新订单状态失败'
			}
		}
	},
	
	/**
	 * 生成订单号
	 */
	generateOrderNo() {
		const date = new Date()
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		const seconds = String(date.getSeconds()).padStart(2, '0')
		const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
		
		return `ORD${year}${month}${day}${hours}${minutes}${seconds}${random}`
	}
}
