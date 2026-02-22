// Mock messages data
export const generateMessages = (userId, role) => {
  const messages = [];

  if (role === 'student') {
    messages.push({
      id: 'msg-001',
      mentorId: 'mentor-001',
      mentorName: 'Sarah Chen',
      mentorAvatar: 'https://i.pravatar.cc/150?img=12',
      lastMessage: 'Looking forward to our session tomorrow!',
      lastMessageZh: '期待明天的课程！',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unread: 1,
    });

    messages.push({
      id: 'msg-002',
      mentorId: 'mentor-002',
      mentorName: 'Michael Rodriguez',
      mentorAvatar: 'https://i.pravatar.cc/150?img=33',
      lastMessage: 'Thanks for sharing your portfolio!',
      lastMessageZh: '感谢分享您的作品集！',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unread: 0,
    });
  } else if (role === 'teacher') {
    messages.push({
      id: 'msg-003',
      studentId: 'student-001',
      studentName: 'Alex Zhang',
      studentAvatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Hi! I have a question about the assignment',
      lastMessageZh: '你好！我对作业有个问题',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      unread: 2,
    });
  }

  return messages;
};

export const generateChatMessages = (chatId) => {
  return [
    {
      id: 'chat-001',
      sender: 'student',
      type: 'text',
      text: 'Hi! I\'m excited about our session tomorrow.',
      textZh: '你好！我对明天的课程很兴奋。',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'chat-002',
      sender: 'mentor',
      type: 'text',
      text: 'Hi! Looking forward to it too. Have you prepared your portfolio pieces?',
      textZh: '你好！我也很期待。你准备好你的作品集了吗？',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    },
    {
      id: 'chat-003',
      sender: 'student',
      type: 'text',
      text: 'Yes, I have 5 pieces ready. Should I send them now?',
      textZh: '是的，我已经准备了5件作品。我现在应该发送它们吗？',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 'chat-004',
      sender: 'mentor',
      type: 'text',
      text: 'That would be great! Send them over and I\'ll review them before our session.',
      textZh: '那太好了！发送过来，我会在课程前审查它们。',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 3 * 60 * 1000),
    },
  ];
};
