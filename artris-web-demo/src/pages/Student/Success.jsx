import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail, Calendar, Clock } from 'lucide-react';

export default function Success() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    const confirmed = localStorage.getItem('booking_confirmed');
    if (confirmed) {
      setBookingInfo(JSON.parse(confirmed));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/student/appointments');
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">
            {i18n.language === 'en' ? 'Booking Confirmed!' : '预约确认成功！'}
          </h1>
          <p className="text-gray-600 mb-6">
            {i18n.language === 'en'
              ? 'Your session has been successfully booked. A confirmation email has been sent to your email address.'
              : '您的课程已成功预约。确认邮件已发送至您的邮箱地址。'
            }
          </p>
        </motion.div>

        {/* Email Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-green-50 border-green-200 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">
                {i18n.language === 'en' ? 'Confirmation Email Sent' : '确认邮件已发送'}
              </p>
              <p className="text-sm text-green-700">
                {i18n.language === 'en'
                  ? 'Check your inbox for booking details and calendar invite'
                  : '请查看您的收件箱，获取预约详情和日历邀请'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Booking Summary */}
        {bookingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-6"
          >
            <h3 className="font-bold text-lg mb-4">
              {i18n.language === 'en' ? 'Booking Summary' : '预约摘要'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {i18n.language === 'en' ? 'Date' : '日期'}
                  </p>
                  <p className="font-semibold">{bookingInfo.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {i18n.language === 'en' ? 'Time' : '时间'}
                  </p>
                  <p className="font-semibold">{bookingInfo.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {i18n.language === 'en' ? 'Mentor' : '导师'}
                  </p>
                  <p className="font-semibold">{bookingInfo.mentorName}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/student/appointments')}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <span>
              {i18n.language === 'en' ? 'View My Appointments' : '查看我的预约'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/student/mentors')}
            className="w-full btn-secondary"
          >
            {i18n.language === 'en' ? 'Browse More Mentors' : '浏览更多导师'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
