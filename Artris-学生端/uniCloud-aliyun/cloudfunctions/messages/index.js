'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const { action, data } = event
	
	try {
		switch (action) {
			case 'send':
				// 发送消息
				const messageData = {
					from_user_id: data.from_user_id,
					to_user_id: data.to_user_id,
					content: data.content,
					read: false,
					create_date: new Date()
				}
				
				const sendResult = await db.collection('messages').add(messageData)
				
				return {
					code: 0,
					data: {
						message_id: sendResult.id
					},
					message: '消息发送成功'
				}
			
			case 'getList':
				// 获取消息列表（会话列表）
				const { user_id } = data
				if (!user_id) {
					return {
						code: -1,
						message: '缺少用户ID'
					}
				}
				
				// 获取所有与该用户相关的消息
				const allMessages = await db.collection('messages')
					.where(db.command.or([
						{ from_user_id: user_id },
						{ to_user_id: user_id }
					]))
					.orderBy('create_date', 'desc')
					.get()
				
				// 按对方用户分组，获取最新一条消息
				const conversationMap = {}
				allMessages.data.forEach(msg => {
					const otherUserId = msg.from_user_id === user_id ? msg.to_user_id : msg.from_user_id
					if (!conversationMap[otherUserId] || 
						msg.create_date > conversationMap[otherUserId].create_date) {
						conversationMap[otherUserId] = {
							...msg,
							other_user_id: otherUserId,
							unread: msg.to_user_id === user_id && !msg.read
						}
					}
				})
				
			// 获取对方用户信息
			const otherUserIds = Object.keys(conversationMap)
			const users = await db.collection('users')
				.where({
					_id: db.command.in(otherUserIds)
				})
				.field({
					_id: true,
					username: true,
					avatar_file: true
				})
				.get()
				
				const userMap = {}
				users.data.forEach(u => {
					userMap[u._id] = u
				})
				
				const conversations = Object.values(conversationMap).map(conv => {
					return {
						...conv,
						other_user: userMap[conv.other_user_id]
					}
				})
				
				return {
					code: 0,
					data: conversations,
					message: 'success'
				}
			
			case 'getChatHistory':
				// 获取聊天记录
				const { user_id: uid1, other_user_id: uid2, page = 1, pageSize = 20 } = data
				
				const chatMessages = await db.collection('messages')
					.where(db.command.or([
						db.command.and([
							{ from_user_id: uid1 },
							{ to_user_id: uid2 }
						]),
						db.command.and([
							{ from_user_id: uid2 },
							{ to_user_id: uid1 }
						])
					]))
					.orderBy('create_date', 'desc')
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.get()
				
				// 标记为已读
				await db.collection('messages')
					.where({
						from_user_id: uid2,
						to_user_id: uid1,
						read: false
					})
					.update({
						read: true
					})
				
				return {
					code: 0,
					data: chatMessages.data.reverse(),
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
