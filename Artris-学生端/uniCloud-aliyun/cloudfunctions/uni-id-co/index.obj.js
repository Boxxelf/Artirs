'use strict';

const db = uniCloud.database()
const dbCmd = db.command
const crypto = require('crypto')

module.exports = {
	_before: function() {
		// 前置操作：某些方法不需要登录
	},
	
	/**
	 * 用户名密码登录
	 */
	async login(params) {
		const { username, password } = params
		
		if (!username || !password) {
			return {
				errCode: 'INVALID_PARAM',
				errMsg: '用户名和密码不能为空'
			}
		}
		
		try {
			// 查询用户
			let userRes
			try {
				userRes = await db.collection('users')
					.where({
						username: username
					})
					.get()
			} catch (err) {
				console.error('查询用户失败:', err)
				// 提供更详细的错误信息
				let errorMsg = '查询用户失败，请稍后重试'
				if (err.message && err.message.includes('不存在')) {
					errorMsg = '数据库集合未创建，请联系管理员'
				} else if (err.message && err.message.includes('resource exhausted')) {
					errorMsg = '数据库连接繁忙，请稍后重试'
				}
				return {
					errCode: 'SYSTEM_ERROR',
					errMsg: errorMsg
				}
			}
			
			if (!userRes.data || userRes.data.length === 0) {
				return {
					errCode: 'USER_NOT_FOUND',
					errMsg: '用户不存在'
				}
			}
			
			const user = userRes.data[0]
			
			// 验证密码（这里使用简单的 MD5，实际应该使用更安全的加密方式）
			const passwordHash = crypto.createHash('md5').update(password).digest('hex')
			
			// 调试日志
			console.log('登录验证 - 用户名:', username)
			console.log('登录验证 - 数据库密码长度:', user.password ? user.password.length : 0)
			console.log('登录验证 - 输入密码hash长度:', passwordHash.length)
			console.log('登录验证 - 密码匹配:', user.password === passwordHash)
			
			if (!user.password) {
				console.error('登录验证 - 用户密码字段为空')
				return {
					errCode: 'PASSWORD_ERROR',
					errMsg: '用户数据异常，请联系管理员'
				}
			}
			
			if (user.password !== passwordHash) {
				console.error('登录验证 - 密码不匹配')
				return {
					errCode: 'PASSWORD_ERROR',
					errMsg: '密码错误'
				}
			}
			
			// 生成 token（简化版，实际应该使用 JWT）
			const token = this.generateToken(user._id)
			
			// 保存 token 到数据库
			await db.collection('tokens').add({
				user_id: user._id,
				token: token,
				create_date: new Date(),
				expire_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天过期
			})
			
			return {
				errCode: 0,
				errMsg: '登录成功',
				uid: user._id,
				token: token, // 返回 token 给客户端
				userInfo: {
					_id: user._id,
					username: user.username,
					email: user.email,
					avatar_file: user.avatar_file,
					extend: user.extend
				}
			}
		} catch (error) {
			console.error('登录失败:', error)
			return {
				errCode: 'SYSTEM_ERROR',
				errMsg: error.message || '登录失败'
			}
		}
	},
	
	/**
	 * 邮箱登录
	 */
	async loginByEmail(params) {
		const { email, password } = params
		
		if (!email || !password) {
			return {
				errCode: 'INVALID_PARAM',
				errMsg: '邮箱和密码不能为空'
			}
		}
		
		try {
			// 查询用户
			let userRes
			try {
				userRes = await db.collection('users')
					.where({
						email: email
					})
					.get()
			} catch (err) {
				console.error('查询用户失败:', err)
				// 提供更详细的错误信息
				let errorMsg = '查询用户失败，请稍后重试'
				if (err.message && err.message.includes('不存在')) {
					errorMsg = '数据库集合未创建，请联系管理员'
				} else if (err.message && err.message.includes('resource exhausted')) {
					errorMsg = '数据库连接繁忙，请稍后重试'
				}
				return {
					errCode: 'SYSTEM_ERROR',
					errMsg: errorMsg
				}
			}
			
			if (!userRes.data || userRes.data.length === 0) {
				return {
					errCode: 'USER_NOT_FOUND',
					errMsg: '用户不存在'
				}
			}
			
			const user = userRes.data[0]
			
			// 验证密码
			const passwordHash = crypto.createHash('md5').update(password).digest('hex')
			
			if (user.password !== passwordHash) {
				return {
					errCode: 'PASSWORD_ERROR',
					errMsg: '密码错误'
				}
			}
			
			// 生成 token
			const token = this.generateToken(user._id)
			
			// 保存 token
			await db.collection('tokens').add({
				user_id: user._id,
				token: token,
				create_date: new Date(),
				expire_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			})
			
			return {
				errCode: 0,
				errMsg: '登录成功',
				uid: user._id,
				token: token, // 返回 token 给客户端
				userInfo: {
					_id: user._id,
					username: user.username,
					email: user.email,
					avatar_file: user.avatar_file,
					extend: user.extend
				}
			}
		} catch (error) {
			console.error('登录失败:', error)
			return {
				errCode: 'SYSTEM_ERROR',
				errMsg: error.message || '登录失败'
			}
		}
	},
	
	/**
	 * 注册
	 */
	async register(params) {
		const { username, email, password, nickname, extend } = params
		
		if (!username || !email || !password) {
			return {
				errCode: 'INVALID_PARAM',
				errMsg: '用户名、邮箱和密码不能为空'
			}
		}
		
		if (password.length < 6) {
			return {
				errCode: 'PASSWORD_TOO_SHORT',
				errMsg: '密码长度至少6位'
			}
		}
		
		try {
			// 检查用户名是否已存在（使用 count 更高效）
			let usernameCheck
			try {
				usernameCheck = await db.collection('users')
					.where({
						username: username
					})
					.count()
			} catch (err) {
				// 如果集合不存在，count 会失败，但我们可以继续创建
				console.warn('检查用户名时出错（可能集合不存在）:', err.message)
				usernameCheck = { total: 0 }
			}
			
			if (usernameCheck.total > 0) {
				return {
					errCode: 'USERNAME_EXISTS',
					errMsg: '用户名已存在'
				}
			}
			
			// 检查邮箱是否已存在
			let emailCheck
			try {
				emailCheck = await db.collection('users')
					.where({
						email: email
					})
					.count()
			} catch (err) {
				console.warn('检查邮箱时出错（可能集合不存在）:', err.message)
				emailCheck = { total: 0 }
			}
			
			if (emailCheck.total > 0) {
				return {
					errCode: 'EMAIL_EXISTS',
					errMsg: '邮箱已被注册'
				}
			}
			
			// 加密密码
			const passwordHash = crypto.createHash('md5').update(password).digest('hex')
			
			// 调试日志
			console.log('注册 - 用户名:', username)
			console.log('注册 - 邮箱:', email)
			console.log('注册 - 密码hash:', passwordHash)
			console.log('注册 - 密码hash长度:', passwordHash.length)
			
			// 创建用户
			const userData = {
				username: username,
				email: email,
				password: passwordHash,
				nickname: nickname || username,
				extend: extend || {},
				create_date: new Date(),
				status: 0 // 0-正常，1-禁用
			}
			
			let createResult
			try {
				createResult = await db.collection('users').add(userData)
			} catch (err) {
				console.error('创建用户失败:', err)
				// 如果是因为集合不存在，提供更友好的错误信息
				if (err.message && err.message.includes('不存在')) {
					return {
						errCode: 'COLLECTION_NOT_FOUND',
						errMsg: '数据库集合未创建，请先上传 users.schema.json 到 uniCloud'
					}
				}
				throw err
			}
			
			// 注册成功后，直接生成 token 并返回用户信息，避免再次查询
			const userId = createResult.id
			const token = this.generateToken(userId)
			
			// 保存 token 到数据库
			try {
				await db.collection('tokens').add({
					user_id: userId,
					token: token,
					create_date: new Date(),
					expire_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天过期
				})
			} catch (tokenErr) {
				console.warn('保存 token 失败（可能 tokens 集合不存在）:', tokenErr.message)
				// token 保存失败不影响注册，token 仍然会返回给客户端
				// 如果 tokens 集合不存在，用户下次登录时可能需要重新生成 token
			}
			
			return {
				errCode: 0,
				errMsg: '注册成功',
				uid: userId,
				token: token, // 直接返回 token
				userInfo: {
					_id: userId,
					username: userData.username,
					email: userData.email,
					nickname: userData.nickname,
					avatar_file: null,
					extend: userData.extend
				}
			}
		} catch (error) {
			console.error('注册失败:', error)
			return {
				errCode: 'SYSTEM_ERROR',
				errMsg: error.message || '注册失败'
			}
		}
	},
	
	/**
	 * 检查 token
	 */
	async checkToken() {
		const token = this.getUniIdToken()
		
		if (!token) {
			return {
				errCode: 'TOKEN_NOT_FOUND',
				errMsg: '未找到 token'
			}
		}
		
		try {
			// 查询 token
			const tokenRes = await db.collection('tokens')
				.where({
					token: token
				})
				.get()
			
			if (tokenRes.data.length === 0) {
				return {
					errCode: 'TOKEN_INVALID',
					errMsg: 'token 无效'
				}
			}
			
			const tokenData = tokenRes.data[0]
			
			// 检查是否过期
			if (new Date() > new Date(tokenData.expire_date)) {
				return {
					errCode: 'TOKEN_EXPIRED',
					errMsg: 'token 已过期'
				}
			}
			
			// 获取用户信息
			const userRes = await db.collection('users')
				.doc(tokenData.user_id)
				.get()
			
			if (userRes.data.length === 0) {
				return {
					errCode: 'USER_NOT_FOUND',
					errMsg: '用户不存在'
				}
			}
			
			const user = userRes.data[0]
			
			return {
				errCode: 0,
				errMsg: 'token 有效',
				userInfo: {
					_id: user._id,
					username: user.username,
					email: user.email,
					avatar_file: user.avatar_file,
					extend: user.extend
				}
			}
		} catch (error) {
			console.error('检查 token 失败:', error)
			return {
				errCode: 'SYSTEM_ERROR',
				errMsg: error.message || '检查 token 失败'
			}
		}
	},
	
	/**
	 * 退出登录
	 */
	async logout() {
		const token = this.getUniIdToken()
		
		if (token) {
			try {
				// 删除 token
				await db.collection('tokens')
					.where({
						token: token
					})
					.remove()
			} catch (error) {
				console.error('退出登录失败:', error)
			}
		}
		
		return {
			errCode: 0,
			errMsg: '退出成功'
		}
	},
	
	/**
	 * 生成 token
	 */
	generateToken(uid) {
		const timestamp = Date.now()
		const random = Math.random().toString(36).substring(2)
		return crypto.createHash('md5').update(`${uid}_${timestamp}_${random}`).digest('hex')
	}
}
