import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  User, 
  LogOut,
  Globe,
  Menu,
  X,
  Star,
  History
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveChat from '../LiveChat/LiveChat';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const studentNavItems = [
    { path: '/student', icon: Home, label: t('student.home.title') },
    { path: '/student/mentors', icon: Users, label: t('student.mentors.title') },
    { path: '/student/appointments', icon: Calendar, label: t('student.appointments.title') },
    { path: '/student/messages', icon: MessageCircle, label: t('student.messages.title') },
    { path: '/student/profile', icon: User, label: t('student.profile.title') },
  ];

  const teacherNavItems = [
    { path: '/teacher', icon: Home, label: t('teacher.home.title') },
    { path: '/teacher/schedule', icon: Calendar, label: t('teacher.schedule.title') },
    { path: '/teacher/reviews', icon: Star, label: language === 'en' ? 'Reviews' : '评价' },
    { path: '/teacher/course-history', icon: History, label: language === 'en' ? 'History' : '历史' },
    { path: '/teacher/messages', icon: MessageCircle, label: t('student.messages.title') },
    { path: '/teacher/profile', icon: User, label: t('student.profile.title') },
  ];

  const navItems = isStudent ? studentNavItems : teacherNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/student' || path === '/teacher') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(isStudent ? '/student' : '/teacher')}
                className="flex items-center space-x-3"
              >
                <img
                  src="/Artirs/ArtrisStudent.png"
                  alt="Artris"
                  className="h-10 w-auto"
                  onError={(e) => {
                    // Try fallback path
                    if (e.target.src !== '/ArtrisStudent.png') {
                      e.target.src = '/ArtrisStudent.png';
                    } else {
                      e.target.style.display = 'none';
                    }
                  }}
                />
                <span className="text-2xl font-bold text-primary-600">
                  Artris
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-1 mr-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language === 'en' ? '中文' : 'English'}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">{t('auth.logout')}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <div className="pt-3 border-t">
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'en' ? '中文' : 'English'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-red-600 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Live Chat Widget */}
      <LiveChat />
    </div>
  );
}
