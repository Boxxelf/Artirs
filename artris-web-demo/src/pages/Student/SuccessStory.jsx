import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, GraduationCap, Award, BookOpen } from 'lucide-react';

const successStories = {
  'alex-zhang': {
    name: 'Alex Zhang',
    nameZh: '张明',
    school: 'RISD',
    schoolZh: 'RISD',
    major: 'Illustration',
    majorZh: '插画',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    mentor: 'Sarah Chen',
    mentorZh: 'Sarah Chen',
    articles: [
      {
        title: 'My Journey to RISD',
        titleZh: '我的RISD申请之路',
        content: 'When I first started my portfolio journey, I had no idea where to begin. Through Artris, I connected with Sarah Chen, who helped me transform my raw ideas into a cohesive portfolio that truly represented my artistic vision. Her guidance on storytelling through illustration was invaluable.',
        contentZh: '当我刚开始我的作品集之旅时，我不知道从哪里开始。通过Artris，我联系到了Sarah Chen，她帮助我将原始想法转化为真正代表我艺术愿景的连贯作品集。她在通过插画讲故事方面的指导非常宝贵。',
        date: '2023-09-15',
      },
      {
        title: 'Building a Strong Portfolio',
        titleZh: '构建强大的作品集',
        content: 'Sarah taught me that a great portfolio isn\'t just about technical skill—it\'s about showing your unique perspective. We worked on 12 pieces together, each telling a different story. The process was challenging but incredibly rewarding.',
        contentZh: 'Sarah告诉我，一个优秀的作品集不仅仅是技术技能，更是展示你独特的视角。我们一起完成了12件作品，每件都讲述不同的故事。这个过程充满挑战，但也非常有收获。',
        date: '2023-10-20',
      },
      {
        title: 'The Artris Experience',
        titleZh: '在Artris的经历',
        content: 'Artris provided me with more than just mentorship. The community of students and mentors created an environment where I could grow as an artist. The feedback sessions, portfolio reviews, and one-on-one guidance were instrumental in my success.',
        contentZh: 'Artris为我提供的不仅仅是导师指导。学生和导师的社区创造了一个我可以作为艺术家成长的环境。反馈会议、作品集审查和一对一指导对我的成功至关重要。',
        date: '2023-12-01',
      },
    ],
    experience: 'Through Artris, I not only got into my dream school but also developed skills that will serve me throughout my career. The mentorship I received was personalized, professional, and transformative.',
    experienceZh: '通过Artris，我不仅进入了梦想的学校，还培养了将在我整个职业生涯中为我服务的技能。我收到的导师指导是个性化的、专业的和变革性的。',
  },
  'sophie-lee': {
    name: 'Sophie Lee',
    nameZh: '李思雨',
    school: 'Parsons',
    schoolZh: 'Parsons',
    major: 'Product Design',
    majorZh: '产品设计',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
    mentor: 'Michael Rodriguez',
    mentorZh: 'Michael Rodriguez',
    articles: [
      {
        title: 'From Concept to Reality',
        titleZh: '从概念到现实',
        content: 'Working with Michael Rodriguez was a game-changer. His expertise in product design and UX/UI helped me understand how to create designs that are both beautiful and functional. His feedback was always constructive and pushed me to think beyond my comfort zone.',
        contentZh: '与Michael Rodriguez合作改变了游戏规则。他在产品设计和UX/UI方面的专业知识帮助我理解如何创建既美观又实用的设计。他的反馈总是建设性的，推动我超越舒适区思考。',
        date: '2023-08-10',
      },
      {
        title: 'Design Thinking Process',
        titleZh: '设计思维过程',
        content: 'Michael introduced me to the design thinking methodology that Parsons values. We worked through user research, ideation, prototyping, and testing. This systematic approach helped me create a portfolio that demonstrated not just my design skills, but my problem-solving abilities.',
        contentZh: 'Michael向我介绍了Parsons重视的设计思维方法。我们进行了用户研究、构思、原型设计和测试。这种系统化的方法帮助我创建了一个不仅展示我的设计技能，还展示我解决问题能力的作品集。',
        date: '2023-09-25',
      },
    ],
    experience: 'Artris connected me with industry professionals who understood what top design schools are looking for. The mentorship was tailored to my goals and helped me stand out in a competitive application pool.',
    experienceZh: 'Artris让我与了解顶级设计学校需求的行业专业人士建立了联系。导师指导是根据我的目标量身定制的，帮助我在竞争激烈的申请池中脱颖而出。',
  },
  'emma-brown': {
    name: 'Emma Brown',
    nameZh: '王雅文',
    school: 'ArtCenter',
    schoolZh: 'ArtCenter',
    major: 'Graphic Design',
    majorZh: '平面设计',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    mentor: 'Emma Thompson',
    mentorZh: 'Emma Thompson',
    articles: [
      {
        title: 'Finding My Visual Voice',
        titleZh: '找到我的视觉声音',
        content: 'Emma Thompson helped me discover my unique style in graphic design. Through our sessions, I learned about typography, color theory, and composition. Her experience at Pentagram gave me insights into professional design practices.',
        contentZh: 'Emma Thompson帮助我发现了我在平面设计中的独特风格。通过我们的课程，我学习了排版、色彩理论和构图。她在Pentagram的经验让我深入了解专业设计实践。',
        date: '2023-07-05',
      },
      {
        title: 'Branding and Identity',
        titleZh: '品牌与形象',
        content: 'We focused heavily on branding projects, which are crucial for ArtCenter applications. Emma guided me through creating cohesive brand identities that told compelling stories. This work became the centerpiece of my portfolio.',
        contentZh: '我们专注于品牌项目，这对ArtCenter申请至关重要。Emma指导我创建讲述引人入胜故事的连贯品牌形象。这项工作成为我作品集的核心。',
        date: '2023-08-18',
      },
    ],
    experience: 'The personalized attention I received through Artris was unmatched. Emma was always available to answer questions and provide feedback, even outside of scheduled sessions. This level of support made all the difference.',
    experienceZh: '我通过Artris获得的个性化关注是无与伦比的。Emma总是可以回答问题并提供反馈，即使在预定课程之外也是如此。这种支持水平产生了巨大的影响。',
  },
  'oliver-taylor': {
    name: 'Oliver Taylor',
    nameZh: '陈浩然',
    school: 'Pratt',
    schoolZh: 'Pratt',
    major: 'Architecture',
    majorZh: '建筑',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
    mentor: 'David Kim',
    mentorZh: 'David Kim',
    articles: [
      {
        title: 'Sustainable Architecture Vision',
        titleZh: '可持续建筑愿景',
        content: 'David Kim\'s expertise in sustainable architecture opened my eyes to the future of design. We worked on projects that combined aesthetic beauty with environmental responsibility. His guidance helped me develop a portfolio that reflected my values and technical skills.',
        contentZh: 'David Kim在可持续建筑方面的专业知识让我看到了设计的未来。我们从事的项目将美学美感与环境责任相结合。他的指导帮助我开发了一个反映我价值观和技术技能的作品集。',
        date: '2023-06-12',
      },
      {
        title: '3D Modeling and Presentation',
        titleZh: '3D建模与展示',
        content: 'David taught me advanced 3D modeling techniques and how to present architectural concepts effectively. The portfolio we created together showcased not just my designs, but my ability to communicate complex ideas visually.',
        contentZh: 'David教给我先进的3D建模技术以及如何有效地展示建筑概念。我们一起创建的作品集不仅展示了我的设计，还展示了我以视觉方式传达复杂想法的能力。',
        date: '2023-07-28',
      },
    ],
    experience: 'Artris provided me with access to mentors who are actively working in the field. David\'s real-world experience and connections gave me insights that I couldn\'t have gotten anywhere else.',
    experienceZh: 'Artris让我能够接触到在该领域积极工作的导师。David的实践经验和人脉给了我无法在其他地方获得的见解。',
  },
};

export default function SuccessStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const storyData = successStories[id];
    if (storyData) {
      setStory(storyData);
    }
  }, [id]);

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">
          {i18n.language === 'en' ? 'Story not found' : '未找到故事'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden h-96 mb-8"
      >
        <img
          src={story.image}
          alt={i18n.language === 'en' ? story.name : story.nameZh}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="bg-accent-400 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
            {i18n.language === 'en' 
              ? `Admitted to ${story.school}`
              : `录取至 ${story.schoolZh}`
            }
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {i18n.language === 'en' ? story.name : story.nameZh}
          </h1>
          <p className="text-lg text-gray-200">
            {i18n.language === 'en' ? story.major : story.majorZh} • {i18n.language === 'en' ? story.school : story.schoolZh}
          </p>
        </div>
      </motion.div>

      {/* Story Content */}
      <div className="space-y-8">
        {/* Articles */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'en' ? 'Articles' : '文章'}
            </h2>
          </div>
          <div className="space-y-6">
            {story.articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {i18n.language === 'en' ? article.title : article.titleZh}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {i18n.language === 'en' ? article.content : article.contentZh}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Artris Experience */}
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-primary-900">
              {i18n.language === 'en' ? 'My Artris Experience' : '我在Artris的经历'}
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {i18n.language === 'en' ? story.experience : story.experienceZh}
          </p>
          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4" />
              <span>
                {i18n.language === 'en' 
                  ? `Mentor: ${story.mentor}`
                  : `导师：${story.mentorZh}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
