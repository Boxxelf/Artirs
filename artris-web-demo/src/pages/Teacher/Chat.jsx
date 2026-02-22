import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import { generateChatMessages } from '../../data/messages';
import { format } from 'date-fns';

const studentData = {
  'student-001': { name: 'Alex Zhang', nameZh: '张明', avatar: 'https://i.pravatar.cc/150?img=5' },
  'student-002': { name: 'Sophie Lee', nameZh: '李思雨', avatar: 'https://i.pravatar.cc/150?img=13' },
  'student-003': { name: 'Emma Brown', nameZh: '王雅文', avatar: 'https://i.pravatar.cc/150?img=20' },
  'student-004': { name: 'Oliver Taylor', nameZh: '陈浩然', avatar: 'https://i.pravatar.cc/150?img=25' },
  'student-005': { name: 'Mia Chen', nameZh: '陈美', avatar: 'https://i.pravatar.cc/150?img=30' },
};

export default function TeacherChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showZoomInput, setShowZoomInput] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const studentInfo = studentData[id];
    if (studentInfo) {
      setStudent(studentInfo);
      const chatMessages = generateChatMessages(id);
      setMessages(chatMessages);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        handleSendImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = (imageData) => {
    const message = {
      id: `msg-${Date.now()}`,
      sender: 'teacher',
      type: 'image',
      image: imageData,
      text: i18n.language === 'en' ? 'Sent an image' : '发送了一张图片',
      textZh: '发送了一张图片',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Simulate student response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'student',
        text: i18n.language === 'en' ? 'Thank you for sharing!' : '感谢分享！',
        textZh: '感谢分享！',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  const generateZoomLink = () => {
    // Generate a mock Zoom link
    const meetingId = Math.random().toString(36).substring(2, 15);
    return `https://zoom.us/j/${meetingId}`;
  };

  const handleSendZoomLink = () => {
    const zoomLink = generateZoomLink();
    const message = {
      id: `msg-${Date.now()}`,
      sender: 'teacher',
      type: 'zoom',
      zoomLink: zoomLink,
      text: i18n.language === 'en' ? 'Zoom meeting link' : 'Zoom会议链接',
      textZh: 'Zoom会议链接',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setShowZoomInput(false);

    // Simulate student response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'student',
        text: i18n.language === 'en' ? 'Got it! I\'ll join at the scheduled time.' : '收到！我会按时加入的。',
        textZh: '收到！我会按时加入的。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: 'teacher',
      type: 'text',
      text: newMessage,
      textZh: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate student response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'student',
        type: 'text',
        text: 'Thank you for your response!',
        textZh: '感谢您的回复！',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  if (!student) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img
          src={student.avatar}
          alt={i18n.language === 'en' ? student.name : student.nameZh}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-bold">
            {i18n.language === 'en' ? student.name : student.nameZh}
          </h2>
          <p className="text-sm text-gray-500">
            {i18n.language === 'en' ? 'Student' : '学生'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'teacher'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.type === 'image' && msg.image && (
                <div className="mb-2">
                  <img
                    src={msg.image}
                    alt="Shared image"
                    className="max-w-full h-auto rounded-lg cursor-pointer"
                    onClick={() => window.open(msg.image, '_blank')}
                  />
                </div>
              )}
              {msg.type === 'zoom' && msg.zoomLink && (
                <div className="mb-2">
                  <a
                    href={msg.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:opacity-80 transition-colors ${
                      msg.sender === 'teacher' 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-primary-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {i18n.language === 'en' ? 'Join Zoom Meeting' : '加入Zoom会议'}
                    </span>
                  </a>
                  <p className={`text-xs mt-1 break-all ${
                    msg.sender === 'teacher' ? 'opacity-70' : 'text-gray-500'
                  }`}>
                    {msg.zoomLink}
                  </p>
                </div>
              )}
              {msg.type !== 'image' && msg.type !== 'zoom' && (
                <p>{i18n.language === 'en' ? msg.text : msg.textZh}</p>
              )}
              <p className={`text-xs mt-1 ${
                msg.sender === 'teacher' ? 'opacity-70' : 'text-gray-500'
              }`}>
                {format(msg.timestamp, 'HH:mm')}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zoom Link Input */}
      {showZoomInput && (
        <div className="mb-2 p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
          <Video className="w-5 h-5 text-primary-600" />
          <span className="text-sm text-gray-600 flex-1">
            {i18n.language === 'en' 
              ? 'Click the button below to generate and send a Zoom meeting link' 
              : '点击下方按钮生成并发送Zoom会议链接'}
          </span>
          <button
            onClick={handleSendZoomLink}
            className="btn-primary px-4 py-2 text-sm"
          >
            {i18n.language === 'en' ? 'Generate & Send' : '生成并发送'}
          </button>
          <button
            onClick={() => setShowZoomInput(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          title={i18n.language === 'en' ? 'Send image' : '发送图片'}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowZoomInput(!showZoomInput)}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
          title={i18n.language === 'en' ? 'Send Zoom link' : '发送Zoom链接'}
        >
          <Video className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('student.messages.typeMessage')}
          className="flex-1 input-field"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
