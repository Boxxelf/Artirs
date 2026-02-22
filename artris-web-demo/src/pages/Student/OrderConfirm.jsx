import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, Clock, DollarSign, ArrowLeft, Mail, Loader } from 'lucide-react';
import { getMentorById } from '../../data/mentors';
import { formatPrice } from '../../utils/priceFormatter';

export default function OrderConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mentor, setMentor] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

  useEffect(() => {
    const mentorData = getMentorById(id);
    const bookingData = JSON.parse(localStorage.getItem('pending_booking') || '{}');
    setMentor(mentorData);
    setBooking(bookingData);
  }, [id]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate email sending
    setShowEmailSent(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save booking confirmation
    localStorage.setItem('booking_confirmed', JSON.stringify({
      ...booking,
      mentorId: id,
      mentorName: mentor.name,
      confirmedAt: new Date().toISOString(),
      emailSent: true,
    }));
    
    localStorage.removeItem('pending_booking');
    
    // Navigate to success page
    navigate('/student/success');
  };

  if (!mentor || !booking) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">
            {i18n.language === 'en' ? 'Review Your Booking' : '确认您的预约'}
          </h1>
          <p className="text-gray-600">
            {i18n.language === 'en' 
              ? 'Please review your booking details before confirming'
              : '请在确认前仔细检查您的预约详情'
            }
          </p>
        </div>

        <div className="card space-y-6 mb-6">
          {/* Mentor Info */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{mentor.name}</h2>
              <p className="text-gray-600">{mentor.school}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {i18n.language === 'en' ? 'Date' : '日期'}
                </p>
                <p className="font-semibold">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {i18n.language === 'en' ? 'Time' : '时间'}
                </p>
                <p className="font-semibold">{booking.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {i18n.language === 'en' ? 'Duration' : '时长'}
                </p>
                <p className="font-semibold">
                  {booking.duration} {i18n.language === 'en' 
                    ? (booking.duration === 1 ? 'hour' : 'hours')
                    : '小时'
                  }
                </p>
              </div>
            </div>

            {booking.note && (
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {i18n.language === 'en' ? 'Note' : '备注'}
                </p>
                <p className="text-gray-700">{booking.note}</p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {i18n.language === 'en' ? 'Subtotal' : '小计'}
              </span>
              <span className="font-semibold">
                {formatPrice(booking.totalPrice, i18n.language).formatted}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('student.mentors.totalPrice')}</span>
              <span className="text-primary-600">
                {formatPrice(booking.totalPrice, i18n.language).formatted}
              </span>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <AnimatePresence>
          {showEmailSent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-green-50 border-green-200 mb-6"
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    {i18n.language === 'en' ? 'Confirmation Email Sent!' : '确认邮件已发送！'}
                  </p>
                  <p className="text-sm text-green-700">
                    {i18n.language === 'en'
                      ? 'A confirmation email has been sent to your email address with all booking details.'
                      : '确认邮件已发送至您的邮箱，包含所有预约详情。'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.back')}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/student/payment/${id}`);
            }}
            disabled={isProcessing}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>
                  {i18n.language === 'en' ? 'Processing...' : '处理中...'}
                </span>
              </>
            ) : (
              <span>
                {i18n.language === 'en' ? 'Continue to Payment' : '继续支付'}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
