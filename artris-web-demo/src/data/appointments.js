// Mock appointments data
export const generateAppointments = (userId, role) => {
  const now = new Date();
  const appointments = [];

  if (role === 'student') {
    // Upcoming appointments
    appointments.push({
      id: 'appt-001',
      mentorId: 'mentor-001',
      mentorName: 'Sarah Chen',
      mentorAvatar: 'https://i.pravatar.cc/150?img=12',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: '14:00',
      duration: 1,
      price: 85,
      status: 'confirmed',
      note: 'Need help with character design portfolio',
      noteZh: '需要帮助角色设计作品集',
      zoomLink: 'https://zoom.us/j/123456789',
      meetingTime: '14:00',
    });

    appointments.push({
      id: 'appt-002',
      mentorId: 'mentor-002',
      mentorName: 'Michael Rodriguez',
      mentorAvatar: 'https://i.pravatar.cc/150?img=33',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: '10:00',
      duration: 2,
      price: 190,
      status: 'pending',
      note: 'Product design portfolio review',
      noteZh: '产品设计作品集审查',
    });

    // Past appointments
    appointments.push({
      id: 'appt-003',
      mentorId: 'mentor-003',
      mentorName: 'Emma Thompson',
      mentorAvatar: 'https://i.pravatar.cc/150?img=47',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      time: '15:00',
      duration: 1,
      price: 80,
      status: 'completed',
      note: 'Graphic design portfolio feedback',
      noteZh: '平面设计作品集反馈',
    });
  } else if (role === 'teacher') {
    // Today's confirmed appointments
    appointments.push({
      id: 'appt-004',
      studentId: 'student-001',
      studentName: 'Alex Zhang',
      studentAvatar: 'https://i.pravatar.cc/150?img=5',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      time: '14:00',
      duration: 1,
      price: 85,
      status: 'confirmed',
      note: 'Character design portfolio review',
      noteZh: '角色设计作品集审查',
      zoomLink: 'https://zoom.us/j/123456789',
      meetingTime: '14:00',
    });

    // Pending requests (4 total)
    appointments.push({
      id: 'appt-005',
      studentId: 'student-002',
      studentName: 'Sophie Lee',
      studentAvatar: 'https://i.pravatar.cc/150?img=13',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      time: '16:00',
      duration: 1,
      price: 85,
      status: 'pending',
      note: 'Portfolio consultation',
      noteZh: '作品集咨询',
    });

    appointments.push({
      id: 'appt-006',
      studentId: 'student-003',
      studentName: 'Emma Brown',
      studentAvatar: 'https://i.pravatar.cc/150?img=20',
      date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      time: '10:00',
      duration: 2,
      price: 190,
      status: 'pending',
      note: 'Product design portfolio review',
      noteZh: '产品设计作品集审查',
    });

    appointments.push({
      id: 'appt-007',
      studentId: 'student-004',
      studentName: 'Oliver Taylor',
      studentAvatar: 'https://i.pravatar.cc/150?img=25',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      time: '15:00',
      duration: 1,
      price: 90,
      status: 'pending',
      note: 'Architecture portfolio feedback',
      noteZh: '建筑作品集反馈',
    });

    appointments.push({
      id: 'appt-008',
      studentId: 'student-005',
      studentName: 'Mia Chen',
      studentAvatar: 'https://i.pravatar.cc/150?img=30',
      date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      time: '11:00',
      duration: 1,
      price: 80,
      status: 'pending',
      note: 'Graphic design consultation',
      noteZh: '平面设计咨询',
    });

    // More confirmed appointments for schedule
    appointments.push({
      id: 'appt-009',
      studentId: 'student-006',
      studentName: 'James Wilson',
      studentAvatar: 'https://i.pravatar.cc/150?img=35',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      time: '13:00',
      duration: 1,
      price: 85,
      status: 'confirmed',
      note: 'Animation portfolio review',
      noteZh: '动画作品集审查',
      zoomLink: 'https://zoom.us/j/987654321',
      meetingTime: '13:00',
    });

    appointments.push({
      id: 'appt-010',
      studentId: 'student-007',
      studentName: 'Lily Anderson',
      studentAvatar: 'https://i.pravatar.cc/150?img=40',
      date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      time: '16:00',
      duration: 2,
      price: 190,
      status: 'confirmed',
      note: 'Illustration portfolio feedback',
      noteZh: '插画作品集反馈',
      zoomLink: 'https://zoom.us/j/456789123',
      meetingTime: '16:00',
    });

    appointments.push({
      id: 'appt-011',
      studentId: 'student-008',
      studentName: 'Noah Martinez',
      studentAvatar: 'https://i.pravatar.cc/150?img=45',
      date: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      time: '14:00',
      duration: 1,
      price: 90,
      status: 'confirmed',
      note: 'Architecture design consultation',
      noteZh: '建筑设计咨询',
      zoomLink: 'https://zoom.us/j/789123456',
      meetingTime: '14:00',
    });
  }

  return appointments;
};
