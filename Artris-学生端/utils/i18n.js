// i18n 双语系统
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
      fail: '失败'
    },
    // 底部导航
    nav: {
      home: '发现',
      mentors: '导师库',
      appointments: '预约',
      messages: '消息',
      profile: '我的'
    },
    // 首页
    home: {
      title: 'Artris',
      searchPlaceholder: '搜索院校、专业或导师',
      exploreNow: '立即探索',
      heroTitle: '遇见你的\n艺术导师',
      heroSubtitle: '开启你的艺术名校之旅，一对一深度指导作品集。',
      categories: {
        all: '全部',
        illustration: '插画',
        product: '产品设计',
        architecture: '建筑'
      },
      featuredMentors: '精选导师',
      allMentors: '全部导师',
      successCases: '成功案例',
      moreAdmissions: '更多录取'
    },
    // 导师
    mentor: {
      title: '导师库',
      detail: '导师详情',
      follow: '关注',
      message: '私信',
      intro: '导师简介',
      startingFrom: 'Starting from',
      bookNow: '立即预约',
      rating: '评分',
      pricePerHour: '/小时',
      pricePerSession: '/次',
      availableThisWeek: '本周可约',
      yearsExperience: '年教学经验',
      specialties: '专业领域'
    },
    // 预约
    booking: {
      selectTime: '选择预约时间',
      month: '月',
      year: '年',
      confirmOrder: '确认订单',
      courseFee: '课程费用',
      coupon: '优惠券',
      totalAmount: '实付金额',
      payNow: '立即支付',
      portfolioGuidance: '作品集指导 (Portfolio Guidance)'
    },
    // 预约成功
    success: {
      title: '预约成功',
      message: '您已成功预约 {mentor} 的课程，请准时参加。',
      viewAppointments: '查看预约',
      backHome: '回到首页'
    },
    // 我的预约
    appointments: {
      title: '我的预约',
      upcoming: '即将开始',
      completed: '已完成',
      enterClassroom: '进入课堂',
      course: '课程',
      date: '日期',
      time: '时间'
    },
    // 消息
    messages: {
      title: '消息',
      noMessages: '暂无消息',
      sendMessage: '发送消息',
      inputPlaceholder: '输入消息...'
    },
    // 个人中心
    profile: {
      title: '我的',
      totalHours: '累计课时',
      favoriteMentors: '收藏导师',
      completedReviews: '完成评价',
      applicationFolder: '申请资料夹',
      myFavorites: '我的收藏'
    },
    // 申请资料夹
    folder: {
      title: '申请资料夹',
      applicationList: '申请清单',
      processing: '申请材料处理中',
      daysLeft: '剩余 {days} 天截止',
      portfolio: '作品集',
      completed: '已完成 {percent}%'
    },
    // 设置
    settings: {
      title: '设置',
      notifications: '通知设置',
      logout: '退出登录',
      language: '语言',
      chinese: '中文',
      english: 'English'
    },
    // 登录
    login: {
      title: '登录',
      welcome: '欢迎来到 Artris',
      subtitle: '开启你的艺术名校之旅',
      username: '用户名/邮箱',
      password: '密码',
      usernamePlaceholder: '请输入用户名或邮箱',
      passwordPlaceholder: '请输入密码',
      loginButton: '登录',
      registerLink: '还没有账号？立即注册',
      forgotPassword: '忘记密码？',
      loginSuccess: '登录成功',
      loginFailed: '登录失败',
      usernameRequired: '请输入用户名或邮箱',
      passwordRequired: '请输入密码',
      loginError: '用户名或密码错误'
    },
    // 注册
    register: {
      title: '注册',
      createAccount: '创建账号',
      subtitle: '加入 Artris，开启艺术之旅',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      school: '学校',
      usernamePlaceholder: '请输入用户名',
      emailPlaceholder: '请输入邮箱',
      passwordPlaceholder: '请输入密码（至少6位）',
      confirmPasswordPlaceholder: '请再次输入密码',
      schoolPlaceholder: '请输入学校名称',
      registerButton: '注册',
      loginLink: '已有账号？立即登录',
      registerSuccess: '注册成功',
      registerFailed: '注册失败',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码长度至少6位',
      emailInvalid: '邮箱格式不正确'
    },
    // 搜索
    search: {
      title: '搜索',
      found: '找到 {count} 位导师',
      noResults: '未找到相关导师'
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
      fail: 'Failed'
    },
    // Bottom Navigation
    nav: {
      home: 'Discover',
      mentors: 'Mentors',
      appointments: 'Appointments',
      messages: 'Messages',
      profile: 'Profile'
    },
    // Home
    home: {
      title: 'Artris',
      searchPlaceholder: 'Search schools, majors or mentors',
      exploreNow: 'Explore Now',
      heroTitle: 'Meet Your\nArt Mentor',
      heroSubtitle: 'Start your journey to top art schools with one-on-one portfolio guidance.',
      categories: {
        all: 'All',
        illustration: 'Illustration',
        product: 'Product Design',
        architecture: 'Architecture'
      },
      featuredMentors: 'Featured Mentors',
      allMentors: 'All Mentors',
      successCases: 'Success Cases',
      moreAdmissions: 'More Admissions'
    },
    // Mentor
    mentor: {
      title: 'Mentors',
      detail: 'Mentor Details',
      follow: 'Follow',
      message: 'Message',
      intro: 'Introduction',
      startingFrom: 'Starting from',
      bookNow: 'Book Now',
      rating: 'Rating',
      pricePerHour: '/hour',
      pricePerSession: '/session',
      availableThisWeek: 'Available This Week',
      yearsExperience: 'years of experience',
      specialties: 'Specialties'
    },
    // Booking
    booking: {
      selectTime: 'Select Appointment Time',
      month: 'Month',
      year: 'Year',
      confirmOrder: 'Confirm Order',
      courseFee: 'Course Fee',
      coupon: 'Coupon',
      totalAmount: 'Total Amount',
      payNow: 'Pay Now',
      portfolioGuidance: 'Portfolio Guidance'
    },
    // Success
    success: {
      title: 'Booking Successful',
      message: 'You have successfully booked a session with {mentor}. Please attend on time.',
      viewAppointments: 'View Appointments',
      backHome: 'Back to Home'
    },
    // Appointments
    appointments: {
      title: 'My Appointments',
      upcoming: 'Upcoming',
      completed: 'Completed',
      enterClassroom: 'Enter Classroom',
      course: 'Course',
      date: 'Date',
      time: 'Time'
    },
    // Messages
    messages: {
      title: 'Messages',
      noMessages: 'No Messages',
      sendMessage: 'Send Message',
      inputPlaceholder: 'Type a message...'
    },
    // Profile
    profile: {
      title: 'Profile',
      totalHours: 'Total Hours',
      favoriteMentors: 'Favorite Mentors',
      completedReviews: 'Completed Reviews',
      applicationFolder: 'Application Folder',
      myFavorites: 'My Favorites'
    },
    // Folder
    folder: {
      title: 'Application Folder',
      applicationList: 'Application List',
      processing: 'Application materials processing',
      daysLeft: '{days} days left',
      portfolio: 'Portfolio',
      completed: '{percent}% completed'
    },
    // Settings
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      logout: 'Logout',
      language: 'Language',
      chinese: '中文',
      english: 'English'
    },
    // Login
    login: {
      title: 'Login',
      welcome: 'Welcome to Artris',
      subtitle: 'Start your journey to top art schools',
      username: 'Username/Email',
      password: 'Password',
      usernamePlaceholder: 'Enter username or email',
      passwordPlaceholder: 'Enter password',
      loginButton: 'Login',
      registerLink: 'No account? Register now',
      forgotPassword: 'Forgot password?',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      usernameRequired: 'Please enter username or email',
      passwordRequired: 'Please enter password',
      loginError: 'Invalid username or password'
    },
    // Register
    register: {
      title: 'Register',
      createAccount: 'Create Account',
      subtitle: 'Join Artris and start your art journey',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      school: 'School',
      usernamePlaceholder: 'Enter username',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password (at least 6 characters)',
      confirmPasswordPlaceholder: 'Enter password again',
      schoolPlaceholder: 'Enter school name',
      registerButton: 'Register',
      loginLink: 'Already have an account? Login',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      emailInvalid: 'Invalid email format'
    },
    // Search
    search: {
      title: 'Search',
      found: 'Found {count} mentors',
      noResults: 'No mentors found'
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
