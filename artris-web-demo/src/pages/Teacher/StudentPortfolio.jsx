import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Eye, User } from 'lucide-react';

// Mock student data
const getStudentById = (id) => {
  const students = {
    'student-001': {
      id: 'student-001',
      name: 'Jerry Cao',
      nameZh: 'Jerry Cao',
      avatar: 'https://i.pravatar.cc/150?img=5',
      email: 'jerry@example.com',
    },
  };
  return students[id] || students['student-001'];
};

export default function StudentPortfolio() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [student, setStudent] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const studentData = getStudentById(studentId);
      setStudent(studentData);
      
      // Load portfolio from localStorage
      const storageKey = `portfolio_${studentId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPortfolioItems(JSON.parse(stored));
      } else {
        // Default items
        const defaultItems = [
          {
            id: 'p1',
            type: 'pdf',
            title: i18n.language === 'en' ? 'Storyboard Calendar Project' : '故事板日历项目',
            description: i18n.language === 'en' 
              ? 'Mixed media sculpture - 3D printed PLA, acrylic sheets, faux moss, paint, wood'
              : '混合媒体雕塑 - 3D打印PLA、亚克力板、人造苔藓、油漆、木材',
            file: '/p1 - 0 2_compressed.pdf',
            thumbnail: '/P3 - 0.jpg',
          },
          {
            id: 'p2',
            type: 'image',
            title: i18n.language === 'en' ? 'Project Image 1' : '项目图片 1',
            description: i18n.language === 'en' ? 'Design process documentation' : '设计过程文档',
            file: '/P3 - 0.jpg',
            thumbnail: '/P3 - 0.jpg',
          },
          {
            id: 'p3',
            type: 'image',
            title: i18n.language === 'en' ? 'Project Image 2' : '项目图片 2',
            description: i18n.language === 'en' ? 'Design process documentation' : '设计过程文档',
            file: '/P3 - 1.jpg',
            thumbnail: '/P3 - 1.jpg',
          },
          {
            id: 'p4',
            type: 'image',
            title: i18n.language === 'en' ? 'Project Image 3' : '项目图片 3',
            description: i18n.language === 'en' ? 'Design process documentation' : '设计过程文档',
            file: '/P3 - 2.jpg',
            thumbnail: '/P3 - 2.jpg',
          },
          {
            id: 'p5',
            type: 'image',
            title: i18n.language === 'en' ? 'Project Image 4' : '项目图片 4',
            description: i18n.language === 'en' ? 'Design process documentation' : '设计过程文档',
            file: '/P3 - 3.jpg',
            thumbnail: '/P3 - 3.jpg',
          },
        ];
        setPortfolioItems(defaultItems);
      }
      setLoading(false);
    }, 500);
  }, [studentId, i18n.language]);

  const handleView = (item) => {
    if (item.type === 'pdf') {
      window.open(item.file, '_blank');
    } else {
      setSelectedItem(item);
    }
  };

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.file;
    link.download = item.file.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-4 flex-1">
          {student && (
            <>
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold">
                  {i18n.language === 'en' ? student.name : student.nameZh}
                </h1>
                <p className="text-gray-600">
                  {i18n.language === 'en' ? 'Student Portfolio' : '学生作品集'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Portfolio Grid */}
      {portfolioItems.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {i18n.language === 'en' 
              ? 'This student has not uploaded any portfolio items yet.' 
              : '该学生尚未上传任何作品集项目。'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.type === 'pdf' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                    <FileText className="w-16 h-16 text-white" />
                  </div>
                ) : (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  {item.type === 'pdf' ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      PDF
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {i18n.language === 'en' ? 'Image' : '图片'}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(item)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{i18n.language === 'en' ? 'View' : '查看'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedItem && selectedItem.type === 'image' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 z-10"
            >
              ×
            </button>
            <img
              src={selectedItem.file}
              alt={selectedItem.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
