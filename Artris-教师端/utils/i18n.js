// i18n 双语系统 - 教师端
const messages = {
  zh: {
    // 通用
    common: {
      confirm: '确认',
      cancel: '取消',
      back: '返回',
      next: '下一步',
      submit: '提交',
      search: '搜索',
      loading: '加载中...',
      noData: '暂无数据',
      success: '成功',
      fail: '失败',
      language: '语言',
      chinese: '中文',
      english: 'English',
      hour: '小时',
      duration: '时长',
      sunday: '日',
      monday: '一',
      tuesday: '二',
      wednesday: '三',
      thursday: '四',
      friday: '五',
      saturday: '六'
    },
    // 底部导航
    nav: {
      home: '首页',
      schedule: '课表',
      earnings: '收入',
      messages: '消息',
      profile: '我的'
    },
    // 首页
    home: {
      title: 'Artris',
      professionalMentor: '专业艺术导师',
      expectedIncome: '本月预计收入',
      viewBill: '查看账单',
      completedHours: '已完成课时',
      pendingConfirm: '待确认',
      newAppointments: '个新预约',
      pendingReply: '待回复',
      newReviews: '个新评价',
      todaySchedule: '今日课表',
      inProgress: '进行中',
      minutesLeft: '距离开始还有 {minutes} 分钟',
      enterClassroom: '进入课堂',
      laterToday: '今日稍后'
    },
    // 课表
    schedule: {
      title: '课表',
      bookingSettings: '预约设置',
      currentPrice: '当前单价',
      modifySettings: '修改设置',
      todaySchedule: '今日日程',
      confirmed: '已确认',
      pendingConfirm: '待确认',
      busyTime: '忙碌时间',
      exception: '例外',
      privateSchedule: '私人行程，不接受预约',
      addException: '添加例外'
    },
    // 收入
    earnings: {
      title: '收入',
      totalBalance: '总余额 (元)',
      withdraw: '提现',
      incomeOverview: '近6个月收入概览',
      growth: '较前半年增长',
      incomeDetails: '收入明细',
      viewAll: '查看全部'
    },
    // 消息
    messages: {
      title: '消息',
      noMessages: '暂无消息',
      developing: '消息中心 (开发中)'
    },
    // 我的
    profile: {
      title: '我的',
      verifiedMentor: '已认证导师',
      accepting: '接课中',
      totalSessions: '累计授课',
      studentRating: '学员评分',
      monthlyEarnings: '本月收益',
      professionalIdentity: '专业身份',
      mentorProfile: '导师资料编辑',
      updateProfile: '更新简介、作品集及学术背景',
      academicManagement: '教务管理',
      serviceSettings: '服务设置',
      defineServices: '定义辅导类型（作品集、面试等）',
      accountPayment: '账户与收款',
      managePayment: '管理银行卡、支付宝及收益结算',
      logout: '退出登录',
      version: 'Artris Mentor v2.4.0'
    },
    // 预约详情
    appointment: {
      title: '预约详情',
      studentInfo: '学生信息',
      courseInfo: '课程信息',
      appointmentTime: '预约时间',
      courseType: '课程类型',
      confirmAppointment: '确认预约',
      rejectAppointment: '拒绝预约',
      confirming: '确认中...',
      confirmSuccess: '预约已确认',
      confirmFailed: '确认失败',
      meetingCreated: '会议已创建',
      emailSent: '邮件已发送'
    }
  },
  en: {
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      search: 'Search',
      loading: 'Loading...',
      noData: 'No Data',
      success: 'Success',
      fail: 'Failed',
      language: 'Language',
      chinese: '中文',
      english: 'English',
      hour: 'hour',
      duration: 'Duration',
      sunday: 'Sun',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat'
    },
    // Bottom Navigation
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      earnings: 'Earnings',
      messages: 'Messages',
      profile: 'Profile'
    },
    // Home
    home: {
      title: 'Artris',
      professionalMentor: 'Professional Art Mentor',
      expectedIncome: 'Expected Income This Month',
      viewBill: 'View Bill',
      completedHours: 'Completed Hours',
      pendingConfirm: 'Pending',
      newAppointments: 'New Appointments',
      pendingReply: 'Pending Reply',
      newReviews: 'New Reviews',
      todaySchedule: 'Today\'s Schedule',
      inProgress: 'In Progress',
      minutesLeft: '{minutes} minutes until start',
      enterClassroom: 'Enter Classroom',
      laterToday: 'Later Today'
    },
    // Schedule
    schedule: {
      title: 'Schedule',
      bookingSettings: 'Booking Settings',
      currentPrice: 'Current Price',
      modifySettings: 'Modify Settings',
      todaySchedule: 'Today\'s Schedule',
      confirmed: 'Confirmed',
      pendingConfirm: 'Pending',
      busyTime: 'Busy Time',
      exception: 'Exception',
      privateSchedule: 'Private schedule, no appointments accepted',
      addException: 'Add Exception'
    },
    // Earnings
    earnings: {
      title: 'Earnings',
      totalBalance: 'Total Balance (CNY)',
      withdraw: 'Withdraw',
      incomeOverview: 'Income Overview (Last 6 Months)',
      growth: 'Growth compared to previous half year',
      incomeDetails: 'Income Details',
      viewAll: 'View All'
    },
    // Messages
    messages: {
      title: 'Messages',
      noMessages: 'No Messages',
      developing: 'Message Center (Under Development)'
    },
    // Profile
    profile: {
      title: 'Profile',
      verifiedMentor: 'Verified Mentor',
      accepting: 'Accepting',
      totalSessions: 'Total Sessions',
      studentRating: 'Student Rating',
      monthlyEarnings: 'Monthly Earnings',
      professionalIdentity: 'Professional Identity',
      mentorProfile: 'Mentor Profile',
      updateProfile: 'Update bio, portfolio and academic background',
      academicManagement: 'Academic Management',
      serviceSettings: 'Service Settings',
      defineServices: 'Define tutoring types (portfolio, interview, etc.)',
      accountPayment: 'Account & Payment',
      managePayment: 'Manage bank cards, Alipay and earnings settlement',
      logout: 'Logout',
      version: 'Artris Mentor v2.4.0'
    },
    // Appointment
    appointment: {
      title: 'Appointment Details',
      studentInfo: 'Student Information',
      courseInfo: 'Course Information',
      appointmentTime: 'Appointment Time',
      courseType: 'Course Type',
      confirmAppointment: 'Confirm Appointment',
      rejectAppointment: 'Reject Appointment',
      confirming: 'Confirming...',
      confirmSuccess: 'Appointment Confirmed',
      confirmFailed: 'Confirmation Failed',
      meetingCreated: 'Meeting Created',
      emailSent: 'Email Sent'
    }
  }
}

// 获取当前语言
function getLanguage() {
  try {
    return uni.getStorageSync('language') || 'zh'
  } catch (e) {
    return 'zh'
  }
}

// 设置语言
function setLanguage(lang) {
  try {
    uni.setStorageSync('language', lang)
  } catch (e) {
    console.error('Failed to save language', e)
  }
}

// 翻译函数
function t(key, params = {}) {
  const lang = getLanguage()
  const keys = key.split('.')
  let value = messages[lang]
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k]
    } else {
      // 如果找不到，尝试使用中文
      value = messages.zh
      for (const k2 of keys) {
        value = value && value[k2]
      }
      break
    }
  }
  
  if (typeof value === 'string') {
    // 替换参数
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match
    })
  }
  
  return key
}

export default {
  getLanguage,
  setLanguage,
  t,
  messages
}
