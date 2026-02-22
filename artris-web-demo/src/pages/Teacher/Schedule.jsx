import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateAppointments } from '../../data/appointments';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { useAlert } from '../../hooks/useAlert.jsx';

export default function Schedule() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      const data = generateAppointments(user?.id, 'teacher');
      setAppointments(data);
      setLoading(false);
    }, 500);
  }, [user]);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );

  // Calendar view functions
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getAppointmentsForDate = (date) => {
    return upcomingAppointments.filter(apt => 
      isSameDay(apt.date, date)
    );
  };

  const weekDays = i18n.language === 'en' 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['日', '一', '二', '三', '四', '五', '六'];

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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
        ? `Your appointment with ${appointment.studentName} has been confirmed!`
        : `您与${appointment.studentName}的预约已确认！`,
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

    // Save to localStorage (simulating backend)
    const existingNotifications = JSON.parse(localStorage.getItem('student_notifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('student_notifications', JSON.stringify(existingNotifications));

    // Show confirmation with details
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

  const generateZoomLink = () => {
    // Generate a mock Zoom link
    const meetingId = Math.random().toString(36).substring(2, 11);
    return `https://zoom.us/j/${meetingId}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('teacher.schedule.title')}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('teacher.schedule.list')}
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('teacher.schedule.calendar')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : view === 'calendar' ? (
        <div className="card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {format(currentDate, i18n.language === 'en' ? 'MMMM yyyy' : 'yyyy年MM月')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month start */}
            {Array.from({ length: getDay(monthStart) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20"></div>
            ))}

            {/* Calendar days */}
            {daysInMonth.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-20 border rounded-lg p-2 ${
                    isToday ? 'bg-primary-50 border-primary-300' : 'border-gray-200'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary-600' : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded truncate ${
                          apt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                        title={apt.studentName}
                      >
                        {apt.time} - {apt.studentName}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} {i18n.language === 'en' ? 'more' : '更多'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : upcomingAppointments.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('teacher.schedule.noAppointments')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((apt, index) => (
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
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{apt.studentName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(apt.date, i18n.language === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日')}</span>
                      </div>
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
                    {(i18n.language === 'en' ? apt.note : apt.noteZh) && (
                      <p className="text-sm text-gray-500 mt-2">
                        {i18n.language === 'en' ? apt.note : apt.noteZh}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/teacher/student-portfolio/${apt.studentId}`)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title={i18n.language === 'en' ? 'View Portfolio' : '查看作品集'}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>{i18n.language === 'en' ? 'Portfolio' : '作品集'}</span>
                  </button>
                  <div className="text-right mr-4">
                    <div className="text-xl font-bold text-primary-600">${apt.price}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t(`student.appointments.status.${apt.status}`)}
                    </span>
                  </div>
                  {apt.status === 'pending' && (
                    <div className="flex space-x-2">
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
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertComponent />
    </div>
  );
}
