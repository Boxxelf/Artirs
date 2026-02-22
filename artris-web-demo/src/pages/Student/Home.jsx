import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock } from 'lucide-react';
import { getMentorsByCategory } from '../../data/mentors';
import { formatPriceWithUnit } from '../../utils/priceFormatter';

export default function StudentHome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mentors = getMentorsByCategory(selectedCategory);
      setFeaturedMentors(mentors.slice(0, 8)); // Show up to 8 mentors
      setLoading(false);
    }, 300);
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: t('student.home.categories.all') },
    { id: 'illustration', label: t('student.home.categories.illustration') },
    { id: 'product', label: t('student.home.categories.product') },
    { id: 'architecture', label: t('student.home.categories.architecture') },
    { id: 'graphic', label: t('student.home.categories.graphic') },
    { id: 'animation', label: t('student.home.categories.animation') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 mb-8 overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('student.home.title')}
          </h1>
          <p className="text-lg text-primary-100 mb-6 max-w-2xl">
            {t('student.home.subtitle')}
          </p>
          <button
            onClick={() => navigate('/student/mentors')}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center space-x-2"
          >
            <span>{t('student.home.exploreNow')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 opacity-20 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400 opacity-20 rounded-full -ml-24 -mb-24"></div>
      </motion.div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setLoading(true);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Mentors */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('student.home.featuredMentors')}
          </h2>
          <button
            onClick={() => navigate('/student/mentors')}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>{t('student.home.allMentors')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card cursor-pointer hover:shadow-xl transition-all"
                onClick={() => navigate(`/student/mentor/${mentor.id}`)}
              >
                <div className="relative mb-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {mentor.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {i18n.language === 'en' ? '✓ Verified' : '✓ 已认证'}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{mentor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{mentor.school} • {mentor.degree}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                    <span className="text-xs text-gray-500">({mentor.reviews})</span>
                  </div>
                  <div className="text-primary-600 font-bold">
                    {formatPriceWithUnit(mentor.price, i18n.language).split('/')[0]}
                    <span className="text-xs text-gray-500">
                      {i18n.language === 'en' ? '/hr' : '/小时'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/booking/${mentor.id}`);
                  }}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  {t('student.mentors.bookNow')}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Success Stories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('student.home.successCases')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'alex-zhang', name: 'Alex Zhang', nameZh: '张明', school: 'RISD', schoolZh: 'RISD', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400' },
            { id: 'sophie-lee', name: 'Sophie Lee', nameZh: '李思雨', school: 'Parsons', schoolZh: 'Parsons', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400' },
            { id: 'emma-brown', name: 'Emma Brown', nameZh: '王雅文', school: 'ArtCenter', schoolZh: 'ArtCenter', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
            { id: 'oliver-taylor', name: 'Oliver Taylor', nameZh: '陈浩然', school: 'Pratt', schoolZh: 'Pratt', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400' },
          ].map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative rounded-xl overflow-hidden h-64 group cursor-pointer"
              onClick={() => navigate(`/student/success-story/${story.id}`)}
            >
              <img
                src={story.image}
                alt={i18n.language === 'en' ? story.name : story.nameZh}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="bg-accent-400 text-white text-xs px-2 py-1 rounded inline-block mb-2">
                  {i18n.language === 'en' 
                    ? `Admitted to ${story.school}`
                    : `录取至 ${story.schoolZh}`
                  }
                </div>
                <p className="font-semibold">{i18n.language === 'en' ? story.name : story.nameZh}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
