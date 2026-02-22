'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const { action, data } = event
	const uniIdToken = event.uniIdToken
	
	try {
		switch (action) {
			case 'create':
				// 创建预约
				const appointmentData = {
					student_id: data.student_id,
					mentor_id: data.mentor_id,
					appointment_date: data.appointment_date,
					appointment_time: data.appointment_time,
					duration: data.duration || 60,
					course_name: data.course_name || '作品集指导',
					price: data.price,
					discount: data.discount || 0,
					total_amount: data.total_amount,
					status: 'pending',
					create_date: new Date(),
					update_date: new Date()
				}
				
				const createResult = await db.collection('appointments').add(appointmentData)
				
				return {
					code: 0,
					data: {
						appointment_id: createResult.id
					},
					message: '预约创建成功'
				}
			
			case 'getList':
				// 获取预约列表
				const { student_id, status, page = 1, pageSize = 10 } = data || {}
				let query = db.collection('appointments')
				
				if (student_id) {
					query = query.where({
						student_id: student_id
					})
				}
				
				if (status) {
					query = query.where({
						status: status
					})
				}
				
				const appointments = await query
					.orderBy('create_date', 'desc')
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.get()
				
				// 联表查询导师信息
				const mentorIds = [...new Set(appointments.data.map(a => a.mentor_id))]
				const mentors = await db.collection('mentors')
					.where({
						_id: db.command.in(mentorIds)
					})
					.get()
				
				const mentorMap = {}
				mentors.data.forEach(m => {
					mentorMap[m._id] = m
				})
				
				const result = appointments.data.map(a => {
					return {
						...a,
						mentor: mentorMap[a.mentor_id]
					}
				})
				
				return {
					code: 0,
					data: result,
					message: 'success'
				}
			
			case 'getDetail':
				// 获取预约详情
				const { appointment_id } = data
				if (!appointment_id) {
					return {
						code: -1,
						message: '缺少预约ID'
					}
				}
				
				const appointment = await db.collection('appointments').doc(appointment_id).get()
				
				if (appointment.data.length === 0) {
					return {
						code: -1,
						message: '预约不存在'
					}
				}
				
				// 获取导师信息
				const mentorInfo = await db.collection('mentors').doc(appointment.data[0].mentor_id).get()
				
				return {
					code: 0,
					data: {
						...appointment.data[0],
						mentor: mentorInfo.data[0]
					},
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
