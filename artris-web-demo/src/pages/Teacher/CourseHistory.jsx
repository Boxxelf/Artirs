import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Star, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateCourseHistory } from '../../data/courseHistory';
import { format } from 'date-fns';

export default function CourseHistory() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = generateCourseHistory(user?.id);
      setCourses(data);
      setLoading(false);
    }, 500);
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {i18n.language === 'en' ? 'Course History' : '课程记录'}
        </h1>
        <p className="text-gray-600">
          {i18n.language === 'en' 
            ? 'View your completed courses and student interactions'
            : '查看您已完成的课程和学生互动'
          }
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {i18n.language === 'en' ? 'No completed courses yet' : '暂无已完成课程'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={course.studentAvatar}
                    alt={course.studentName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{course.studentName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(course.date, i18n.language === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    {course.note && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {i18n.language === 'en' ? course.note : course.noteZh}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary-600">${course.price}</div>
                  <div className="text-sm text-gray-500">
                    {course.duration} {i18n.language === 'en' ? 'hour' : '小时'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseDetailModal({ course, onClose }) {
  const { i18n } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {i18n.language === 'en' ? 'Course Details' : '课程详情'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Info */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
            <img
              src={course.studentAvatar}
              alt={course.studentName}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold">{course.studentName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>{format(course.date, i18n.language === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日')}</span>
                <span>{course.time}</span>
                <span>{course.duration} {i18n.language === 'en' ? 'hours' : '小时'}</span>
              </div>
            </div>
          </div>

          {/* Course Notes */}
          <div className="mb-6">
            <h4 className="font-bold mb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span>{i18n.language === 'en' ? 'Course Notes' : '课程笔记'}</span>
            </h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
              {i18n.language === 'en' ? course.note : course.noteZh}
            </p>
          </div>

          {/* Student Work */}
          {course.studentWork && course.studentWork.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold mb-3 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-primary-600" />
                <span>{i18n.language === 'en' ? 'Student Work' : '学生作品'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {course.studentWork.map((work, index) => (
                  <img
                    key={index}
                    src={work}
                    alt={`Student work ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rating and Earnings */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold">{course.rating}</span>
              {course.review && (
                <span className="text-sm text-gray-500 ml-2">
                  "{i18n.language === 'en' ? course.review : course.reviewZh}"
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {i18n.language === 'en' ? 'Earnings' : '收入'}
              </div>
              <div className="text-2xl font-bold text-primary-600">${course.price}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
