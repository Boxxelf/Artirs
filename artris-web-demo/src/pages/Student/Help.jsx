import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, BookOpen, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: i18n.language === 'en' 
        ? 'How do I book a session with a mentor?'
        : '如何预约导师课程？',
      answer: i18n.language === 'en'
        ? 'To book a session, go to the Mentors page, select a mentor you\'re interested in, and click "Book Session". Choose your preferred date and time, then confirm your booking. You\'ll receive a confirmation email with all the details.'
        : '要预约课程，请前往导师页面，选择您感兴趣的导师，然后点击"预约课程"。选择您偏好的日期和时间，然后确认预约。您将收到包含所有详情的确认邮件。',
    },
    {
      id: 2,
      question: i18n.language === 'en'
        ? 'How do I communicate with my mentor?'
        : '如何与导师沟通？',
      answer: i18n.language === 'en'
        ? 'You can message your mentor directly through the Messages page. Click on a mentor\'s conversation to start chatting. You can send text messages, images, and Zoom meeting links.'
        : '您可以通过消息页面直接向导师发送消息。点击导师的对话开始聊天。您可以发送文本消息、图片和Zoom会议链接。',
    },
    {
      id: 3,
      question: i18n.language === 'en'
        ? 'What should I prepare for my first session?'
        : '第一次课程应该准备什么？',
      answer: i18n.language === 'en'
        ? 'Before your first session, prepare your portfolio or work samples, any questions you have, and make sure you have a stable internet connection if it\'s an online session. Your mentor will send you a Zoom link before the session.'
        : '在第一次课程之前，请准备您的作品集或作品样本、您的问题，如果是在线课程，请确保网络连接稳定。您的导师会在课程前发送Zoom链接。',
    },
    {
      id: 4,
      question: i18n.language === 'en'
        ? 'Can I cancel or reschedule a session?'
        : '我可以取消或改期课程吗？',
      answer: i18n.language === 'en'
        ? 'Yes, you can cancel or reschedule sessions through the My Appointments page. Please note that cancellation policies may vary depending on the mentor and timing of your request.'
        : '是的，您可以通过"我的预约"页面取消或改期课程。请注意，取消政策可能因导师和您提出请求的时间而异。',
    },
    {
      id: 5,
      question: i18n.language === 'en'
        ? 'How do I upload my portfolio?'
        : '如何上传我的作品集？',
      answer: i18n.language === 'en'
        ? 'Go to your Profile page and click on "My Portfolio". From there, you can view and manage your portfolio items. You can upload images and PDFs to showcase your work.'
        : '前往您的个人资料页面，点击"我的作品集"。您可以在那里查看和管理您的作品集项目。您可以上传图片和PDF来展示您的作品。',
    },
    {
      id: 6,
      question: i18n.language === 'en'
        ? 'What payment methods are accepted?'
        : '接受哪些支付方式？',
      answer: i18n.language === 'en'
        ? 'We accept major credit cards, debit cards, and PayPal. All payments are processed securely through our payment gateway.'
        : '我们接受主要信用卡、借记卡和PayPal。所有付款都通过我们的支付网关安全处理。',
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: i18n.language === 'en' ? 'Email Support' : '邮件支持',
      description: i18n.language === 'en' 
        ? 'Send us an email and we\'ll get back to you within 24 hours.'
        : '发送邮件给我们，我们会在24小时内回复。',
      action: i18n.language === 'en' ? 'Send Email' : '发送邮件',
      link: 'mailto:support@artris.com',
    },
    {
      icon: MessageCircle,
      title: i18n.language === 'en' ? 'Live Chat' : '在线聊天',
      description: i18n.language === 'en'
        ? 'Chat with our support team in real-time.'
        : '与我们的支持团队实时聊天。',
      action: i18n.language === 'en' ? 'Start Chat' : '开始聊天',
      link: '/student/messages',
    },
    {
      icon: BookOpen,
      title: i18n.language === 'en' ? 'Help Center' : '帮助中心',
      description: i18n.language === 'en'
        ? 'Browse our comprehensive help articles and guides.'
        : '浏览我们全面的帮助文章和指南。',
      action: i18n.language === 'en' ? 'Browse Articles' : '浏览文章',
      link: '#',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">
          {i18n.language === 'en' ? 'Help & Support' : '帮助与支持'}
        </h1>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{method.description}</p>
              {method.link.startsWith('mailto:') || method.link.startsWith('http') ? (
                <a
                  href={method.link}
                  className="btn-primary text-sm py-2 px-4 inline-block"
                >
                  {method.action}
                </a>
              ) : (
                <button
                  onClick={() => navigate(method.link)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  {method.action}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">
            {i18n.language === 'en' ? 'Frequently Asked Questions' : '常见问题'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-left flex-1">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openFaq === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-white"
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4">
          {i18n.language === 'en' ? 'Additional Resources' : '其他资源'}
        </h2>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <span>{i18n.language === 'en' ? 'User Guide' : '用户指南'}</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <span>{i18n.language === 'en' ? 'Terms of Service' : '服务条款'}</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <span>{i18n.language === 'en' ? 'Privacy Policy' : '隐私政策'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
