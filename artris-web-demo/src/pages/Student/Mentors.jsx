import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Search, Filter, CheckCircle } from 'lucide-react';
import { formatPriceWithUnit } from '../../utils/priceFormatter';
import { getAllMentors } from '../../data/mentors';

export default function Mentors() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    school: 'all',
    rating: 'all',
  });

  useEffect(() => {
    setTimeout(() => {
      const allMentors = getAllMentors();
      setMentors(allMentors);
      setFilteredMentors(allMentors);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...mentors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Price filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter((mentor) => {
        if (max) {
          return mentor.price >= min && mentor.price <= max;
        }
        return mentor.price >= min;
      });
    }

    // School filter
    if (filters.school !== 'all') {
      filtered = filtered.filter((mentor) => mentor.school === filters.school);
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = Number(filters.rating);
      filtered = filtered.filter((mentor) => mentor.rating >= minRating);
    }

    setFilteredMentors(filtered);
  }, [searchQuery, filters, mentors]);

  const schools = [...new Set(mentors.map((m) => m.school))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('student.mentors.title')}
        </h1>
        <p className="text-gray-600">
          {i18n.language === 'en'
            ? 'Find the perfect mentor for your portfolio journey'
            : '为您的作品集之旅找到完美的导师'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={i18n.language === 'en' ? 'Search mentors...' : '搜索导师...'}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('common.all')} {t('common.filter')}</option>
            <option value="0-50">$0 - $50/hr</option>
            <option value="50-80">$50 - $80/hr</option>
            <option value="80-100">$80 - $100/hr</option>
            <option value="100-999">$100+/hr</option>
          </select>

          <select
            value={filters.school}
            onChange={(e) => setFilters({ ...filters, school: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('common.all')} Schools</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('common.all')} Ratings</option>
            <option value="4.5">4.5+ ⭐</option>
            <option value="4.7">4.7+ ⭐</option>
            <option value="4.8">4.8+ ⭐</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {i18n.language === 'en'
            ? `Found ${filteredMentors.length} mentors`
            : `找到 ${filteredMentors.length} 位导师`}
        </p>
      </div>

      {/* Mentors List */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('common.noData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card cursor-pointer hover:shadow-xl transition-all"
              onClick={() => navigate(`/student/mentor/${mentor.id}`)}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-32 h-32 md:w-24 md:h-24 rounded-xl object-cover"
                  />
                  {mentor.verified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {mentor.name}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        {mentor.school} • {mentor.degree}
                      </p>
                      <p className="text-sm text-gray-500">
                        {mentor.currentCompany} • {mentor.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {formatPriceWithUnit(mentor.price, i18n.language).split('/')[0]}
                        <span className="text-sm text-gray-500 font-normal">
                          {i18n.language === 'en' ? '/hr' : '/小时'}
                        </span>
                      </div>
                      {mentor.available && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {t('student.mentors.availableThisWeek')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mentor.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({mentor.reviews} {t('student.mentors.reviews')})
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {mentor.experience} {t('student.mentors.yearsExperience')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.specialties.slice(0, 3).map((specialty, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {mentor.specialties.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{mentor.specialties.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/mentor/${mentor.id}`);
                      }}
                      className="btn-secondary"
                    >
                      {t('student.mentors.viewProfile')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/booking/${mentor.id}`);
                      }}
                      className="btn-primary"
                    >
                      {t('student.mentors.bookNow')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
