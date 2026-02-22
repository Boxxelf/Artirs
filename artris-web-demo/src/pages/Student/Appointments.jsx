import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, X, Video, Bell, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateAppointments } from '../../data/appointments';
import { format } from 'date-fns';

export default function Appointments() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const data = generateAppointments(user?.id, 'student');
      setAppointments(data);
      
      // Load notifications
      const savedNotifications = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      const unreadNotifications = savedNotifications.filter(n => !n.read);
      setNotifications(unreadNotifications);
      
      // Show latest notification if exists
      if (unreadNotifications.length > 0) {
        setShowNotification(unreadNotifications[0]);
      }
      
      setLoading(false);
    }, 500);
  }, [user]);

  const markNotificationAsRead = (notificationId) => {
    const savedNotifications = JSON.parse(localStorage.getItem('student_notifications') || '[]');
    const updated = savedNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('student_notifications', JSON.stringify(updated));
    setNotifications(updated.filter(n => !n.read));
    setShowNotification(null);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'upcoming') {
      return apt.status === 'confirmed' || apt.status === 'pending';
    }
    if (filter === 'past') {
      return apt.status === 'completed';
    }
    if (filter === 'cancelled') {
      return apt.status === 'cancelled';
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('student.appointments.title')}</h1>

      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-green-50 border-green-200 mb-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Bell className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-2">
                    {i18n.language === 'en' ? 'Appointment Confirmed!' : '预约已确认！'}
                  </h3>
                  <p className="text-green-700 mb-3">
                    {i18n.language === 'en' ? showNotification.message : showNotification.messageZh}
                  </p>
                  {showNotification.details && (
                    <div className="bg-white rounded-lg p-4 space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {i18n.language === 'en' ? 'Date' : '日期'}: {showNotification.details.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {i18n.language === 'en' ? 'Time' : '时间'}: {showNotification.details.time}
                        </span>
                      </div>
                      {showNotification.details.zoomLink && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Video className="w-4 h-4 text-gray-500" />
                          <a
                            href={showNotification.details.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>
                              {i18n.language === 'en' ? 'Join Zoom Meeting' : '加入Zoom会议'}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => markNotificationAsRead(showNotification.id)}
                className="p-2 hover:bg-green-100 rounded-lg"
              >
                <X className="w-5 h-5 text-green-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['upcoming', 'past', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t(`student.appointments.${f}`)}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('student.appointments.noAppointments')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={apt.mentorAvatar}
                    alt={apt.mentorName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{apt.mentorName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(apt.date, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {apt.duration} {i18n.language === 'en' 
                            ? (apt.duration === 1 ? 'hour' : 'hours')
                            : '小时'
                          }
                        </span>
                      </div>
                      {apt.zoomLink && (
                        <div className="flex items-center space-x-1 text-primary-600">
                          <Video className="w-4 h-4" />
                          <a
                            href={apt.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline flex items-center space-x-1"
                          >
                            <span>{i18n.language === 'en' ? 'Zoom Link' : 'Zoom链接'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    {(i18n.language === 'en' ? apt.note : apt.noteZh) && (
                      <p className="text-sm text-gray-500 mt-2">
                        {i18n.language === 'en' ? apt.note : apt.noteZh}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                    {t(`student.appointments.status.${apt.status}`)}
                  </span>
                  {apt.status === 'confirmed' && (
                    <div className="flex items-center space-x-2">
                      {apt.zoomLink ? (
                        <a
                          href={apt.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>{t('student.appointments.joinSession')}</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => navigate(`/student/classroom/${apt.id}`)}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>{t('student.appointments.joinSession')}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
