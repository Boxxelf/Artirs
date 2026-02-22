import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Briefcase, GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react';
import { getMentorById } from '../../data/mentors';
import { getReviewsByMentorId } from '../../data/reviews';
import { formatPriceWithUnit } from '../../utils/priceFormatter';

export default function MentorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    setTimeout(() => {
      const mentorData = getMentorById(id);
      const reviewsData = getReviewsByMentorId(id);
      setMentor(mentorData);
      setReviews(reviewsData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Mentor not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Mentor Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-32 h-32 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-3xl font-bold">{mentor.name}</h1>
                      {mentor.verified && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-2">
                      {mentor.school} • {mentor.degree}
                    </p>
                    <p className="text-gray-500">
                      {mentor.currentCompany} • {mentor.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatPriceWithUnit(mentor.price, i18n.language).split('/')[0]}
                      <span className="text-lg text-gray-500 font-normal">
                        {i18n.language === 'en' ? '/hr' : '/小时'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{mentor.rating}</span>
                    <span className="text-gray-500">
                      ({mentor.reviews} {t('student.mentors.reviews')})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{mentor.experience} {t('student.mentors.yearsExperience')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {mentor.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {['about', 'education', 'experience', 'portfolio', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t(`student.mentors.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            {activeTab === 'about' && (
              <div>
                <h3 className="text-xl font-bold mb-4">{t('student.mentors.about')}</h3>
                <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
              </div>
            )}

            {activeTab === 'education' && (
              <div>
                <h3 className="text-xl font-bold mb-4">{t('student.mentors.education')}</h3>
                <div className="space-y-4">
                  {mentor.education.map((edu, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <GraduationCap className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold">{edu.school}</p>
                        <p className="text-gray-600">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div>
                <h3 className="text-xl font-bold mb-4">{t('student.mentors.experience')}</h3>
                <div className="space-y-4">
                  {mentor.workExperience.map((exp, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Briefcase className="w-6 h-6 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold">{exp.company}</p>
                        <p className="text-gray-600">{exp.position}</p>
                        <p className="text-sm text-gray-500">{exp.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <h3 className="text-xl font-bold mb-4">{t('student.mentors.portfolio')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentor.portfolio.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {reviews.length} {t('student.mentors.reviews')}
                </h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start space-x-3 mb-2">
                        <img
                          src={review.studentAvatar}
                          alt={review.studentName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.studentName}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">
                        {i18n.language === 'en' ? review.text : review.textZh}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card sticky top-24"
          >
            <h3 className="text-xl font-bold mb-4">{t('student.mentors.selectTime')}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Available Times</p>
                <div className="space-y-2">
                  {Object.entries(mentor.availability)
                    .slice(0, 3)
                    .map(([day, times]) => (
                      <div key={day} className="text-sm">
                        <span className="font-medium capitalize">{day}:</span>{' '}
                        <span className="text-gray-600">{times.join(', ')}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/student/booking/${mentor.id}`)}
              className="w-full btn-primary py-3 text-lg"
            >
              {t('student.mentors.bookNow')}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
