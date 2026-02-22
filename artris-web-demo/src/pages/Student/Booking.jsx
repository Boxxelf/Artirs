import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { getMentorById } from '../../data/mentors';
import { format } from 'date-fns';
import { formatPrice, formatPriceWithUnit } from '../../utils/priceFormatter';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mentor, setMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMentor(getMentorById(id));
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading || !mentor) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

  // Calculate total price (always in USD, will be formatted based on language)
  const totalPriceUSD = mentor.price * duration;
  
  // Map day names to availability keys
  const dayNameMap = {
    'mon': 'monday',
    'tue': 'tuesday',
    'wed': 'wednesday',
    'thu': 'thursday',
    'fri': 'friday',
    'sat': 'saturday',
    'sun': 'sunday',
  };

  const availableTimes = selectedDate
    ? mentor.availability[dayNameMap[selectedDate.toLowerCase().slice(0, 3)]] || []
    : [];

  // Generate next 7 days
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      console.warn('Please select both date and time');
      return;
    }
    
    // Format the selected date for display
    const selectedDateObj = dates.find(d => {
      const dayName = format(d, 'EEE').toLowerCase();
      return dayName === selectedDate;
    });
    
    const formattedDate = selectedDateObj 
      ? format(selectedDateObj, i18n.language === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日')
      : selectedDate;
    
    // Store booking data
    const bookingData = {
      mentorId: mentor.id,
      mentorName: mentor.name,
      date: formattedDate,
      time: selectedTime,
      duration,
      totalPrice: totalPriceUSD,
      note,
    };
    
    try {
      localStorage.setItem('pending_booking', JSON.stringify(bookingData));
      navigate(`/student/order-confirm/${id}`);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center space-x-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{mentor.name}</h2>
                <p className="text-gray-600">{mentor.school}</p>
              </div>
            </div>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">{t('student.mentors.selectTime')}</h3>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {dates.map((date) => {
                const dayName = format(date, 'EEE').toLowerCase();
                const isSelected = selectedDate === dayName;
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(dayName);
                      setSelectedTime('');
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {format(date, 'EEE')}
                    </div>
                    <div className="font-semibold">{format(date, 'd')}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <p className="text-sm text-gray-600 mb-3">Select Time</p>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedTime === time
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Duration Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">{t('student.mentors.selectDuration')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setDuration(hours)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    duration === hours
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="font-semibold text-lg">
                    {hours} {i18n.language === 'en' ? (hours === 1 ? 'Hour' : 'Hours') : '小时'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPrice(mentor.price * hours, i18n.language).formatted}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('student.mentors.addNote')}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="input-field"
              placeholder={i18n.language === 'en' ? 'Tell your mentor about your goals...' : '告诉导师您的目标...'}
            />
          </motion.div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card sticky top-24"
          >
            <h3 className="text-lg font-semibold mb-4">{t('student.mentors.totalPrice')}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Rate' : '费率'}
                </span>
                <span>{formatPriceWithUnit(mentor.price, i18n.language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Duration' : '时长'}
                </span>
                <span>
                  {duration} {i18n.language === 'en' 
                    ? (duration === 1 ? 'hour' : 'hours')
                    : '小时'}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>{t('student.mentors.totalPrice')}</span>
                <span className="text-primary-600">
                  {formatPrice(totalPriceUSD, i18n.language).formatted}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('student.mentors.confirmBooking')}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
