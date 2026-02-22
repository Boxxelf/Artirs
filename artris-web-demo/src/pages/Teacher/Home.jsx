import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Clock, CheckCircle, XCircle, Star, Users, ArrowRight, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateAppointments } from '../../data/appointments';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useAlert } from '../../hooks/useAlert.jsx';
import { getLatestReviews } from '../../data/teacherReviews';

export default function TeacherHome() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();
  const [appointments, setAppointments] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    thisWeekCount: 0,
    averageRating: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = generateAppointments(user?.id, 'teacher');
      setAppointments(data);
      
      const today = new Date();
      const todayAppts = data.filter(
        (apt) => format(apt.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      );
      
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      const thisWeekAppts = data.filter((apt) => 
        isWithinInterval(apt.date, { start: weekStart, end: weekEnd }) &&
        (apt.status === 'confirmed' || apt.status === 'pending')
      );
      
      // Calculate unique students
      const uniqueStudents = new Set(data.map(apt => apt.studentId));
      
      // Get latest reviews
      const reviews = getLatestReviews(3);
      
      setStats({
        todayCount: todayAppts.length,
        pendingCount: data.filter((apt) => apt.status === 'pending').length,
        thisWeekCount: thisWeekAppts.length,
        averageRating: 4.8, // Mock rating
        totalStudents: uniqueStudents.size,
      });
      
      setLatestReviews(reviews);
      setLoading(false);
    }, 500);
  }, [user]);

  const todayAppointments = appointments.filter(
    (apt) => format(apt.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const generateZoomLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 11);
    return `https://zoom.us/j/${meetingId}`;
  };

  const handleAcceptAppointment = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const zoomLink = generateZoomLink();
    const meetingTime = appointment.time;
    const meetingDate = format(appointment.date, i18n.language === 'en' ? 'MMMM d, yyyy' : 'yyyy年MM月dd日');

    // Update appointment status
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'confirmed', 
            zoomLink, 
            meetingTime,
            confirmedAt: new Date().toISOString(),
            notificationSent: true
          }
        : apt
    );
    setAppointments(updatedAppointments);

    // Save notification for student
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'appointment_confirmed',
      studentId: appointment.studentId,
      studentName: appointment.studentName,
      appointmentId: appointmentId,
      message: i18n.language === 'en'
        ? `Your appointment has been confirmed!`
        : `您的预约已确认！`,
      messageZh: `您的预约已确认！`,
      details: {
        date: meetingDate,
        time: meetingTime,
        zoomLink: zoomLink,
        duration: appointment.duration,
        mentor: i18n.language === 'en' ? 'Your Teacher' : '您的导师',
      },
      timestamp: new Date().toISOString(),
      read: false,
    };

    const existingNotifications = JSON.parse(localStorage.getItem('student_notifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('student_notifications', JSON.stringify(existingNotifications));

    setTimeout(() => {
      showAlert({
        type: 'success',
        title: i18n.language === 'en' ? 'Appointment Confirmed!' : '预约已确认！',
        message: i18n.language === 'en' 
          ? 'Student has been notified with meeting details.'
          : '已通知学生会议详情。',
        details: [
          { label: i18n.language === 'en' ? 'Date' : '日期', value: meetingDate },
          { label: i18n.language === 'en' ? 'Time' : '时间', value: meetingTime },
          { label: i18n.language === 'en' ? 'Zoom Link' : 'Zoom链接', value: zoomLink, link: true },
        ],
      });
    }, 500);
  };

  const handleRejectAppointment = (appointmentId) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(updatedAppointments);
    
    showAlert({
      type: 'info',
      title: i18n.language === 'en' ? 'Appointment Rejected' : '预约已拒绝',
      message: i18n.language === 'en' 
        ? 'Student has been notified.'
        : '已通知学生。',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('teacher.home.welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600">{t('teacher.home.title')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('teacher.home.todayAppointments')}</p>
              <p className="text-2xl font-bold">{stats.todayCount}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('teacher.home.pendingRequests')}</p>
              <p className="text-2xl font-bold">{stats.pendingCount}</p>
            </div>
            <MessageCircle className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {i18n.language === 'en' ? 'This Week' : '本周预约'}
              </p>
              <p className="text-2xl font-bold">{stats.thisWeekCount}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {i18n.language === 'en' ? 'Average Rating' : '平均评分'}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">{stats.averageRating}</p>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <Star className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* Today's Appointments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('teacher.home.todayAppointments')}</h2>
          <button
            onClick={() => navigate('/teacher/schedule')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('teacher.home.viewAll')}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="card text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {i18n.language === 'en' ? 'No appointments today' : '今日暂无预约'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={apt.studentAvatar}
                      alt={apt.studentName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold">{apt.studentName}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{apt.time}</span>
                        </div>
                        <span>
                          {apt.duration} {i18n.language === 'en' 
                            ? (apt.duration === 1 ? 'hour' : 'hours')
                            : '小时'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary-600">${apt.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {stats.pendingCount > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t('teacher.home.pendingRequests')}</h2>
          <div className="space-y-4">
            {appointments
              .filter((apt) => apt.status === 'pending')
              .slice(0, 4)
              .map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={apt.studentAvatar}
                        alt={apt.studentName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{apt.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          {format(apt.date, 'MMM d, yyyy')} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleAcceptAppointment(apt.id)}
                        className="btn-primary flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{t('teacher.schedule.accept')}</span>
                      </button>
                      <button 
                        onClick={() => handleRejectAppointment(apt.id)}
                        className="btn-secondary flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t('teacher.schedule.reject')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
        {/* Course History Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-primary-50 to-accent-50"
          onClick={() => navigate('/teacher/course-history')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <History className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold">
                  {i18n.language === 'en' ? 'Course History' : '课程记录'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {i18n.language === 'en' 
                  ? 'View your completed courses and student interactions'
                  : '查看您已完成的课程和学生互动'
                }
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                <span>{i18n.language === 'en' ? 'View All' : '查看全部'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <History className="w-16 h-16 text-primary-600 opacity-20" />
          </div>
        </motion.div>

        {/* Reviews Card */}
        {latestReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-yellow-50 to-orange-50"
            onClick={() => navigate('/teacher/reviews')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-400" />
                  <h3 className="text-lg font-bold">
                    {i18n.language === 'en' ? 'Student Reviews' : '学生评价'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {i18n.language === 'en' 
                    ? `See what ${latestReviews.length} students say about your teaching`
                    : `查看${latestReviews.length}位学生对您教学的反馈`
                  }
                </p>
                <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                  <span>{i18n.language === 'en' ? 'View All' : '查看全部'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Star className="w-16 h-16 text-yellow-600 opacity-20 fill-yellow-400" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Latest Reviews */}
      {latestReviews.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {i18n.language === 'en' ? 'Latest Reviews' : '最新评价'}
            </h2>
            <button
              onClick={() => navigate('/teacher/reviews')}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
            >
              <span>{i18n.language === 'en' ? 'View All' : '查看全部'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate('/teacher/reviews')}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={review.studentAvatar}
                    alt={review.studentName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{review.studentName}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {i18n.language === 'en' ? review.text : review.textZh}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {format(review.date, i18n.language === 'en' ? 'MMM d' : 'MM月dd日')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AlertComponent />
    </div>
  );
}
