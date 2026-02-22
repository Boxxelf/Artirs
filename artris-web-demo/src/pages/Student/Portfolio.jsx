import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Image as ImageIcon, Download, Eye, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Portfolio() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { studentId } = useParams(); // For teacher viewing student portfolio
  const isViewMode = !!studentId; // If studentId exists, it's view mode (teacher viewing)
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    file: null,
    thumbnail: null,
    type: 'image',
  });

  // Load portfolio items from localStorage
  useEffect(() => {
    const storageKey = studentId ? `portfolio_${studentId}` : `portfolio_${user?.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setPortfolioItems(JSON.parse(stored));
    } else {
      // Default items for demo
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
      localStorage.setItem(storageKey, JSON.stringify(defaultItems));
    }
  }, [user?.id, studentId]);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          type: 'pdf',
          file: reader.result,
          thumbnail: null,
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          type: 'image',
          file: reader.result,
          thumbnail: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.file) return;

    const item = {
      id: `item-${Date.now()}`,
      ...newItem,
    };

    const storageKey = `portfolio_${user?.id}`;
    const updated = [...portfolioItems, item];
    setPortfolioItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setNewItem({
      title: '',
      description: '',
      file: null,
      thumbnail: null,
      type: 'image',
    });
    setIsAdding(false);
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem.title || !editingItem.file) return;

    const storageKey = `portfolio_${user?.id}`;
    const updated = portfolioItems.map(item =>
      item.id === editingItem.id ? editingItem : item
    );
    setPortfolioItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (!confirm(i18n.language === 'en' ? 'Are you sure you want to delete this item?' : '确定要删除这个项目吗？')) {
      return;
    }

    const storageKey = `portfolio_${user?.id}`;
    const updated = portfolioItems.filter(item => item.id !== itemId);
    setPortfolioItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">
            {isViewMode 
              ? (i18n.language === 'en' ? 'Student Portfolio' : '学生作品集')
              : (i18n.language === 'en' ? 'My Portfolio' : '我的作品集')
            }
          </h1>
        </div>
        {!isViewMode && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{i18n.language === 'en' ? 'Add Item' : '添加项目'}</span>
          </button>
        )}
      </div>

      {/* Add Item Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {i18n.language === 'en' ? 'Add New Item' : '添加新项目'}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewItem({
                  title: '',
                  description: '',
                  file: null,
                  thumbnail: null,
                  type: 'image',
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'en' ? 'Title' : '标题'}
              </label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="input-field"
                placeholder={i18n.language === 'en' ? 'Enter title...' : '输入标题...'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'en' ? 'Description' : '描述'}
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder={i18n.language === 'en' ? 'Enter description...' : '输入描述...'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'en' ? 'File' : '文件'}
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="input-field"
              />
            </div>
            {newItem.file && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {i18n.language === 'en' ? 'Selected file:' : '已选择文件：'}
                </p>
                {newItem.type === 'image' && (
                  <img src={newItem.thumbnail} alt="Preview" className="max-w-xs h-32 object-cover rounded" />
                )}
                {newItem.type === 'pdf' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <FileText className="w-5 h-5" />
                    <span>PDF File</span>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleAddItem}
              disabled={!newItem.title || !newItem.file}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {i18n.language === 'en' ? 'Add Item' : '添加项目'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Edit Item Form */}
      {editingItem && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {i18n.language === 'en' ? 'Edit Item' : '编辑项目'}
            </h2>
            <button
              onClick={() => setEditingItem(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'en' ? 'Title' : '标题'}
              </label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'en' ? 'Description' : '描述'}
              </label>
              <textarea
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <button
              onClick={handleSaveEdit}
              disabled={!editingItem.title || !editingItem.file}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {i18n.language === 'en' ? 'Save Changes' : '保存更改'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Portfolio Grid */}
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
                {!isViewMode && (
                  <>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex items-center justify-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
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
