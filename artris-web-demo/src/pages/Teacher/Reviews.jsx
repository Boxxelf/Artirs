import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';
import { getReviewsByTeacherId, getAverageRating } from '../../data/teacherReviews';
import { format } from 'date-fns';

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = getReviewsByTeacherId();
      setReviews(data);
      setAverageRating(getAverageRating(data));
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {i18n.language === 'en' ? 'Student Reviews' : '学生评价'}
        </h1>
        <p className="text-gray-600">
          {i18n.language === 'en' 
            ? 'See what your students say about your teaching'
            : '查看学生对您教学的反馈'
          }
        </p>
      </div>

      {/* Average Rating Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8 bg-gradient-to-r from-primary-50 to-accent-50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {i18n.language === 'en' ? 'Average Rating' : '平均评分'}
            </p>
            <div className="flex items-center space-x-3">
              <div className="text-4xl font-bold text-primary-600">{averageRating}</div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">
                ({reviews.length} {i18n.language === 'en' ? 'reviews' : '条评价'})
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={review.studentAvatar}
                  alt={review.studentName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{review.studentName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{format(review.date, i18n.language === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {i18n.language === 'en' ? review.text : review.textZh}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
