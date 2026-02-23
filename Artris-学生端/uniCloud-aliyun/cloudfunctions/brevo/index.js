'use strict';

const axios = require('axios')

// Brevo API 配置（从环境变量读取，必须设置 BREVO_API_KEY）
const BREVO_API_KEY = process.env.BREVO_API_KEY
if (!BREVO_API_KEY) {
	throw new Error('BREVO_API_KEY 环境变量未设置，请在 uniCloud 控制台配置环境变量')
}
const BREVO_API_URL = 'https://api.brevo.com/v3'

// 发送邮件
async function sendEmail(to, subject, htmlContent) {
	try {
		const response = await axios.post(
			`${BREVO_API_URL}/smtp/email`,
			{
				sender: {
					name: 'Artris',
					email: 'noreply@artris.com'
				},
				to: [{ email: to }],
				subject: subject,
				htmlContent: htmlContent
			},
			{
				headers: {
					'api-key': BREVO_API_KEY,
					'Content-Type': 'application/json'
				}
			}
		)
		return {
			success: true,
			data: response.data
		}
	} catch (error) {
		console.error('Brevo API Error:', error.response?.data || error.message)
		return {
			success: false,
			error: error.response?.data || error.message
		}
	}
}

exports.main = async (event, context) => {
	const { action, data } = event
	
	try {
		switch (action) {
			case 'sendAppointmentEmail':
				// 发送预约确认邮件（老师确认预约后调用）
				const { studentEmail, mentorEmail, studentName, mentorName, appointmentDate, appointmentTime, zoomJoinUrl } = data
				
				// 发送给学生
				const studentSubject = `预约确认 - ${mentorName} 的课程`
				const studentHtml = `
					<h2>预约确认</h2>
					<p>亲爱的 ${studentName}，</p>
					<p>您的预约已确认！</p>
					<p><strong>导师：</strong>${mentorName}</p>
					<p><strong>日期：</strong>${appointmentDate}</p>
					<p><strong>时间：</strong>${appointmentTime}</p>
					<p><strong>Zoom 会议链接：</strong><a href="${zoomJoinUrl}">${zoomJoinUrl}</a></p>
					<p>请准时参加课程。</p>
					<p>祝好，<br>Artris 团队</p>
				`
				
				const studentResult = await sendEmail(studentEmail, studentSubject, studentHtml)
				
				// 发送给老师
				const mentorSubject = `新预约确认 - ${studentName} 的课程`
				const mentorHtml = `
					<h2>新预约确认</h2>
					<p>亲爱的 ${mentorName}，</p>
					<p>您有一个新的预约已确认！</p>
					<p><strong>学生：</strong>${studentName}</p>
					<p><strong>日期：</strong>${appointmentDate}</p>
					<p><strong>时间：</strong>${appointmentTime}</p>
					<p><strong>Zoom 会议链接：</strong><a href="${zoomJoinUrl}">${zoomJoinUrl}</a></p>
					<p>请准时参加课程。</p>
					<p>祝好，<br>Artris 团队</p>
				`
				
				const mentorResult = await sendEmail(mentorEmail, mentorSubject, mentorHtml)
				
				return {
					code: 0,
					data: {
						student: studentResult,
						mentor: mentorResult
					},
					message: '邮件发送完成'
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
