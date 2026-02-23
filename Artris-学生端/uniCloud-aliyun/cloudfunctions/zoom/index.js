const axios = require('axios')
const crypto = require('crypto')



// 获取 Token
async function getZoomToken() {
  const credentials = Buffer.from(
    `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
  ).toString('base64')

  const res = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    null,
    { headers: { Authorization: `Basic ${credentials}` } }
  )
  return res.data.access_token
}

exports.main = async (event) => {
  const { action } = event

  // 创建会议（导师调用）
  if (action === 'createMeeting') {
    const token = await getZoomToken()
    const res = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: event.topic || '艺术课程',
        type: 2,
        duration: event.duration || 60,
        settings: {
          waiting_room: true,
          host_video: true,
          participant_video: true
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return {
      meetingId: res.data.id,
      joinUrl: res.data.join_url,
      startUrl: res.data.start_url,
      password: res.data.password
    }
  }

  // 生成 Signature（导师学生都要）
  if (action === 'getSignature') {
    const { meetingNumber, role } = event
    const timestamp = new Date().getTime() - 30000
    const msg = Buffer.from(
      ZOOM_SDK_KEY + meetingNumber + timestamp + role
    ).toString('base64')
    const hash = crypto
      .createHmac('sha256', ZOOM_SDK_SECRET)
      .update(msg)
      .digest('base64')
    const signature = Buffer.from(
      `${ZOOM_SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString('base64')
    return { signature }
  }
}