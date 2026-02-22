// Realistic reviews data
export const reviews = {
  'mentor-001': [
    {
      id: 'review-001',
      studentName: 'Alex Zhang',
      studentAvatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      date: '2024-01-15',
      text: 'Sarah is an amazing mentor! She helped me completely transform my portfolio. Her feedback on my character design work was incredibly detailed and actionable. I got accepted to RISD thanks to her guidance!',
      textZh: 'Sarah是一位非常棒的导师！她帮助我完全改变了我的作品集。她对我的角色设计作品的反馈非常详细且可操作。多亏了她的指导，我被RISD录取了！',
    },
    {
      id: 'review-002',
      studentName: 'Maya Patel',
      studentAvatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      date: '2024-01-10',
      text: 'Working with Sarah was a game-changer. She has deep industry knowledge and knows exactly what admissions committees are looking for. Highly recommend!',
      textZh: '与Sarah合作改变了我的申请。她拥有深厚的行业知识，完全了解招生委员会想要什么。强烈推荐！',
    },
    {
      id: 'review-003',
      studentName: 'Ryan Chen',
      studentAvatar: 'https://i.pravatar.cc/150?img=11',
      rating: 4,
      date: '2023-12-20',
      text: 'Great mentor with real-world experience. Her portfolio review sessions were very helpful. The only minor issue was timezone differences, but we worked it out.',
      textZh: '拥有真实世界经验的优秀导师。她的作品集审查课程非常有帮助。唯一的小问题是时区差异，但我们解决了。',
    },
  ],
  'mentor-002': [
    {
      id: 'review-004',
      studentName: 'Sophie Lee',
      studentAvatar: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      date: '2024-01-18',
      text: 'Michael is exceptional! His expertise in product design and UX is unmatched. He helped me understand design thinking and create a portfolio that got me into Parsons.',
      textZh: 'Michael非常出色！他在产品设计和用户体验方面的专业知识无与伦比。他帮助我理解设计思维，并创建了一个让我进入Parsons的作品集。',
    },
    {
      id: 'review-005',
      studentName: 'Daniel Kim',
      studentAvatar: 'https://i.pravatar.cc/150?img=16',
      rating: 5,
      date: '2024-01-05',
      text: 'Best investment I made for my portfolio. Michael\'s feedback is always constructive and he pushes you to think critically about your work. Got accepted to ArtCenter!',
      textZh: '我为作品集做的最好的投资。Michael的反馈总是建设性的，他推动你批判性地思考你的作品。被ArtCenter录取了！',
    },
  ],
  'mentor-003': [
    {
      id: 'review-006',
      studentName: 'Emma Brown',
      studentAvatar: 'https://i.pravatar.cc/150?img=20',
      rating: 5,
      date: '2024-01-12',
      text: 'Emma helped me develop a cohesive visual identity for my portfolio. Her knowledge of typography and branding is incredible. Highly professional and supportive!',
      textZh: 'Emma帮助我为我的作品集开发了一个有凝聚力的视觉识别。她对排版和品牌的知识令人难以置信。非常专业和支持！',
    },
  ],
  'mentor-004': [
    {
      id: 'review-007',
      studentName: 'Oliver Taylor',
      studentAvatar: 'https://i.pravatar.cc/150?img=22',
      rating: 5,
      date: '2024-01-08',
      text: 'David\'s expertise in sustainable architecture is outstanding. He helped me refine my portfolio projects and understand what top architecture schools are looking for.',
      textZh: 'David在可持续建筑方面的专业知识非常出色。他帮助我完善了我的作品集项目，并了解了顶级建筑学校想要什么。',
    },
  ],
  'mentor-005': [
    {
      id: 'review-008',
      studentName: 'Isabella Garcia',
      studentAvatar: 'https://i.pravatar.cc/150?img=25',
      rating: 5,
      date: '2024-01-14',
      text: 'Lisa is an amazing animation mentor! Her character animation demos were so helpful. She helped me create a demo reel that got me into CalArts.',
      textZh: 'Lisa是一位出色的动画导师！她的角色动画演示非常有帮助。她帮助我创建了一个让我进入CalArts的演示卷轴。',
    },
  ],
  'mentor-006': [
    {
      id: 'review-009',
      studentName: 'Charlotte White',
      studentAvatar: 'https://i.pravatar.cc/150?img=27',
      rating: 4,
      date: '2024-01-06',
      text: 'James provided great guidance on my fashion portfolio. His industry experience at Ralph Lauren really shows in his feedback. Very professional!',
      textZh: 'James为我的时装作品集提供了很好的指导。他在Ralph Lauren的行业经验在他的反馈中真正体现出来。非常专业！',
    },
  ],
};

export const getReviewsByMentorId = (mentorId) => reviews[mentorId] || [];
