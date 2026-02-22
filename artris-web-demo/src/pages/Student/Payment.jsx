import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard, CheckCircle, Loader, Shield, Eye, EyeOff } from 'lucide-react';
import { getMentorById } from '../../data/mentors';
import { formatPrice, formatPriceWithUnit } from '../../utils/priceFormatter';

// Credit card type detection
const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6(?:011|5)/.test(number)) return 'discover';
  return 'default';
};

// Format card number with spaces
const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

// Format expiry date (MM/YY)
const formatExpiry = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mentor, setMentor] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  
  // Payment form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('default');

  useEffect(() => {
    const mentorData = getMentorById(id);
    const bookingData = JSON.parse(localStorage.getItem('pending_booking') || '{}');
    setMentor(mentorData);
    setBooking(bookingData);
    
    // Load saved card if exists
    const savedCard = localStorage.getItem('saved_card');
    if (savedCard) {
      const card = JSON.parse(savedCard);
      setFormData(prev => ({
        ...prev,
        cardNumber: card.cardNumber,
        cardholderName: card.cardholderName,
        expiryDate: card.expiryDate,
        saveCard: true,
      }));
      setCardType(getCardType(card.cardNumber));
    }
  }, [id]);

  useEffect(() => {
    if (formData.cardNumber) {
      setCardType(getCardType(formData.cardNumber));
    }
  }, [formData.cardNumber]);

  const validateForm = () => {
    const newErrors = {};
    
    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = i18n.language === 'en' 
        ? 'Please enter a valid card number' 
        : '请输入有效的卡号';
    } else if (!/^\d+$/.test(cardNumber)) {
      newErrors.cardNumber = i18n.language === 'en' 
        ? 'Card number must contain only digits' 
        : '卡号只能包含数字';
    }
    
    // Cardholder name validation
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = i18n.language === 'en' 
        ? 'Please enter cardholder name' 
        : '请输入持卡人姓名';
    }
    
    // Expiry date validation
    const expiry = formData.expiryDate.replace(/\//g, '');
    if (!expiry || expiry.length !== 4) {
      newErrors.expiryDate = i18n.language === 'en' 
        ? 'Please enter a valid expiry date (MM/YY)' 
        : '请输入有效的过期日期 (MM/YY)';
    } else {
      const month = parseInt(expiry.substring(0, 2));
      const year = parseInt('20' + expiry.substring(2, 4));
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = i18n.language === 'en' 
          ? 'Invalid month' 
          : '无效的月份';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = i18n.language === 'en' 
          ? 'Card has expired' 
          : '卡片已过期';
      }
    }
    
    // CVV validation
    if (!formData.cvv || formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = i18n.language === 'en' 
        ? 'Please enter a valid CVV' 
        : '请输入有效的CVV';
    } else if (!/^\d+$/.test(formData.cvv)) {
      newErrors.cvv = i18n.language === 'en' 
        ? 'CVV must contain only digits' 
        : 'CVV只能包含数字';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save card if requested
    if (formData.saveCard) {
      localStorage.setItem('saved_card', JSON.stringify({
        cardNumber: formData.cardNumber,
        cardholderName: formData.cardholderName,
        expiryDate: formData.expiryDate,
        cardType: cardType,
        last4: formData.cardNumber.slice(-4),
      }));
    }
    
    // Save booking confirmation
    localStorage.setItem('booking_confirmed', JSON.stringify({
      ...booking,
      mentorId: id,
      mentorName: mentor.name,
      confirmedAt: new Date().toISOString(),
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
    }));
    
    localStorage.removeItem('pending_booking');
    
    // Navigate to success page
    navigate('/student/success');
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="w-5 h-5 text-primary-600" />
              <h1 className="text-2xl font-bold">
                {i18n.language === 'en' ? 'Payment Information' : '支付信息'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {i18n.language === 'en' ? 'Card Number' : '卡号'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    {getCardIcon()}
                  </div>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder={i18n.language === 'en' ? '1234 5678 9012 3456' : '1234 5678 9012 3456'}
                    maxLength={19}
                    className={`input-field pl-14 ${errors.cardNumber ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {i18n.language === 'en' ? 'Cardholder Name' : '持卡人姓名'}
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value.toUpperCase())}
                  placeholder={i18n.language === 'en' ? 'JOHN DOE' : '张三'}
                  className={`input-field ${errors.cardholderName ? 'border-red-500' : ''}`}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                )}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {i18n.language === 'en' ? 'Expiry Date' : '过期日期'}
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      {showCvv ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type={showCvv ? 'text' : 'password'}
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Save Card Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={formData.saveCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, saveCard: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="saveCard" className="text-sm text-gray-700">
                  {i18n.language === 'en' 
                    ? 'Save card for future payments' 
                    : '保存卡片以便将来支付'}
                </label>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">
                    {i18n.language === 'en' ? 'Secure Payment' : '安全支付'}
                  </p>
                  <p>
                    {i18n.language === 'en'
                      ? 'Your payment information is encrypted and secure. We never store your full card details.'
                      : '您的支付信息已加密并安全。我们从不存储您的完整卡片信息。'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>
                      {i18n.language === 'en' ? 'Processing Payment...' : '处理支付中...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>
                      {i18n.language === 'en' 
                        ? `Pay ${formatPrice(booking.totalPrice, i18n.language).formatted}` 
                        : `支付 ${formatPrice(booking.totalPrice, i18n.language).formatted}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card sticky top-24"
          >
            <h2 className="text-lg font-bold mb-4">
              {i18n.language === 'en' ? 'Order Summary' : '订单摘要'}
            </h2>

            {/* Mentor Info */}
            <div className="flex items-center space-x-3 pb-4 border-b mb-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{mentor.name}</p>
                <p className="text-sm text-gray-600">{mentor.school}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Date' : '日期'}
                </span>
                <span className="font-medium">{booking.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Time' : '时间'}
                </span>
                <span className="font-medium">{booking.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Duration' : '时长'}
                </span>
                <span className="font-medium">
                  {booking.duration} {i18n.language === 'en' 
                    ? (booking.duration === 1 ? 'hour' : 'hours')
                    : '小时'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Subtotal' : '小计'}
                </span>
                <span>{formatPrice(booking.totalPrice, i18n.language).formatted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? 'Processing Fee' : '手续费'}
                </span>
                <span>{formatPrice(0, i18n.language).formatted}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{i18n.language === 'en' ? 'Total' : '总计'}</span>
                <span className="text-primary-600">
                  {formatPrice(booking.totalPrice, i18n.language).formatted}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
