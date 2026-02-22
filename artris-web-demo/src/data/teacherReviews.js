// Teacher reviews data
export const teacherReviews = [
  {
    id: 'review-001',
    studentId: 'student-001',
    studentName: 'Alex Zhang',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    appointmentId: 'appt-004',
    rating: 5,
    text: 'Sarah is an amazing mentor! She helped me refine my portfolio and gave me invaluable feedback. Her expertise in character design is outstanding.',
    textZh: 'Sarah是一位出色的导师！她帮助我完善作品集并提供了宝贵的反馈。她在角色设计方面的专业知识非常出色。',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    courseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'review-002',
    studentId: 'student-002',
    studentName: 'Sophie Lee',
    studentAvatar: 'https://i.pravatar.cc/150?img=13',
    appointmentId: 'appt-005',
    rating: 5,
    text: 'Excellent guidance on product design. Michael provided clear feedback and helped me understand the design thinking process.',
    textZh: '产品设计方面的优秀指导。Michael提供了清晰的反馈，帮助我理解设计思维过程。',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    courseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'review-003',
    studentId: 'student-003',
    studentName: 'Emma Brown',
    studentAvatar: 'https://i.pravatar.cc/150?img=20',
    appointmentId: 'appt-006',
    rating: 4,
    text: 'Great session on graphic design fundamentals. Very professional and patient.',
    textZh: '关于平面设计基础知识的精彩课程。非常专业和耐心。',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    courseDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'review-004',
    studentId: 'student-004',
    studentName: 'Oliver Taylor',
    studentAvatar: 'https://i.pravatar.cc/150?img=25',
    appointmentId: 'appt-007',
    rating: 5,
    text: 'David\'s expertise in architecture is impressive. He helped me improve my 3D modeling skills significantly.',
    textZh: 'David在建筑方面的专业知识令人印象深刻。他帮助我显著提高了3D建模技能。',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    courseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'review-005',
    studentId: 'student-005',
    studentName: 'Mia Chen',
    studentAvatar: 'https://i.pravatar.cc/150?img=30',
    appointmentId: 'appt-008',
    rating: 5,
    text: 'Outstanding teaching! The feedback was detailed and actionable. Highly recommend!',
    textZh: '出色的教学！反馈详细且可操作。强烈推荐！',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    courseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

export const getReviewsByTeacherId = (teacherId) => {
  return teacherReviews;
};

export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const getLatestReviews = (count = 3) => {
  return teacherReviews
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};
