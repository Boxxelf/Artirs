'use strict';

const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
	_before: function() {
		// 前置操作：验证用户是否登录（可选，某些方法可能不需要）
		// 注意：uniCloud 会自动从本地存储的 uni_id_token 中读取 token 并传递给云对象
	},
	
	/**
	 * 获取当前用户ID（从 token 中）
	 */
	async getCurrentUserId() {
		// uniCloud 云对象会自动从请求中获取 token
		// getUniIdToken() 方法会从请求头中读取 uniIdToken
		let token = this.getUniIdToken()
		
		// 调试日志
		console.log('getCurrentUserId - token:', token ? '存在' : '不存在')
		
		if (!token) {
			console.warn('getCurrentUserId - 未找到 token')
			console.warn('getCurrentUserId - 提示：请确保登录后 token 已保存到 uni_id_token')
			return null
		}
		
		try {
			const tokenRes = await db.collection('tokens')
				.where({
					token: token
				})
				.get()
			
			console.log('getCurrentUserId - token查询结果数量:', tokenRes.data.length)
			
			if (tokenRes.data.length === 0) {
				console.warn('getCurrentUserId - token 在数据库中不存在')
				return null
			}
			
			const tokenData = tokenRes.data[0]
			
			// 检查是否过期
			const now = new Date()
			const expireDate = new Date(tokenData.expire_date)
			if (now > expireDate) {
				console.warn('getCurrentUserId - token 已过期', {
					now: now.toISOString(),
					expire: expireDate.toISOString()
				})
				return null
			}
			
			console.log('getCurrentUserId - 成功获取用户ID:', tokenData.user_id)
			return tokenData.user_id
		} catch (error) {
			console.error('获取用户ID失败:', error)
			return null
		}
	},
	
	/**
	 * 创建订单
	 * @param {Object} data - 订单数据
	 * @param {String} data.mentor_id - 导师ID
	 * @param {String} data.appointment_date - 预约日期
	 * @param {String} data.appointment_time - 预约时间
	 * @param {Number} data.duration - 时长（分钟）
	 * @param {String} data.course_name - 课程名称
	 * @param {Number} data.price - 原价
	 * @param {Number} data.discount - 优惠金额
	 * @param {Number} data.total_amount - 实付金额
	 */
	async create(data) {
		// 优先从 token 获取用户ID
		let uid = await this.getCurrentUserId()
		
		// 如果无法从 token 获取，尝试从参数中获取（备用方案）
		if (!uid && data.user_id) {
			uid = data.user_id
			console.log('create - 使用参数中的 user_id:', uid)
		}
		
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
			student_id: uid, // 从 context 获取用户ID
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
	 * @param {String} params.role - 角色：student（学生）或 mentor（导师）
	 * @param {String} params.status - 订单状态筛选
	 * @param {Number} params.page - 页码
	 * @param {Number} params.pageSize - 每页数量
	 */
	async getList(params = {}) {
		// 优先从 token 获取用户ID
		let uid = await this.getCurrentUserId()
		
		// 如果无法从 token 获取，尝试从参数中获取（备用方案）
		if (!uid && params.user_id) {
			uid = params.user_id
			console.log('getList - 使用参数中的 user_id:', uid)
		}
		
		// 如果还是没有，尝试从本地存储获取（仅用于调试）
		if (!uid) {
			console.warn('getList - 无法获取用户ID，请检查登录状态')
			return {
				code: -1,
				message: '用户未登录，请先登录',
				data: []
			}
		}
		
		const { role = 'student', status, page = 1, pageSize = 10 } = params
		
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
				// 默认查询用户相关的所有订单（学生或导师）
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
			
			// 获取导师信息（如果是学生查询）
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
			
			// 获取学生信息（如果是导师查询）
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
				const orderObj = {
					...order,
					mentor: mentorMap[order.mentor_id] || null,
					student: studentMap[order.student_id] || null
				}
				return orderObj
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
			
			// 验证权限：只有订单相关的学生或导师可以查看
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
			
			// 权限验证：只有导师可以确认订单，学生可以取消订单
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
	 * @returns {String} 订单号
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
