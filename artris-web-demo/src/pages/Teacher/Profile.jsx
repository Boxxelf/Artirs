import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, HelpCircle, Shield, History, Star } from 'lucide-react';

export default function TeacherProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { i18n } = useTranslation();
  
  const menuItems = [
    { icon: History, label: i18n.language === 'en' ? 'Course History' : '课程记录', path: '/teacher/course-history' },
    { icon: Star, label: i18n.language === 'en' ? 'Student Reviews' : '学生评价', path: '/teacher/reviews' },
    { icon: Shield, label: t('teacher.verification.title'), path: '/teacher/verification' },
    { icon: Settings, label: t('student.profile.settings'), path: '/teacher/settings' },
    { icon: HelpCircle, label: t('student.profile.help'), path: '/teacher/help' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('student.profile.title')}</h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-2 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
              Teacher
            </span>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
