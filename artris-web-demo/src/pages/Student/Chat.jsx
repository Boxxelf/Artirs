import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Image as ImageIcon, Video, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMentorById } from '../../data/mentors';
import { generateChatMessages } from '../../data/messages';
import { format } from 'date-fns';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mentor, setMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showZoomInput, setShowZoomInput] = useState(false);
  const [zoomLinkInput, setZoomLinkInput] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const mentorData = getMentorById(id);
    const chatMessages = generateChatMessages(id);
    setMentor(mentorData);
    setMessages(chatMessages);
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
      sender: 'student',
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

    // Simulate mentor response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'mentor',
        text: i18n.language === 'en' ? 'Thanks for sharing! I\'ll review it.' : '感谢分享！我会查看的。',
        textZh: '感谢分享！我会查看的。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleSendZoomLink = (zoomLink) => {
    if (!zoomLink.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      type: 'zoom',
      zoomLink: zoomLink,
      text: i18n.language === 'en' ? 'Zoom meeting link' : 'Zoom会议链接',
      textZh: 'Zoom会议链接',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setShowZoomInput(false);

    // Simulate mentor response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'mentor',
        text: i18n.language === 'en' ? 'Got it! I\'ll join at the scheduled time.' : '收到！我会按时加入的。',
        textZh: '收到！我会按时加入的。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      type: 'text',
      text: newMessage,
      textZh: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate mentor response
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now()}`,
        sender: 'mentor',
        type: 'text',
        text: 'Thanks for your message! I\'ll get back to you soon.',
        textZh: '感谢您的消息！我会尽快回复您。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  if (!mentor) {
    return <div>Loading...</div>;
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
          src={mentor.avatar}
          alt={mentor.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-bold">{mentor.name}</h2>
          <p className="text-sm text-gray-500">{mentor.school}</p>
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
            className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'student'
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
                    className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {i18n.language === 'en' ? 'Join Zoom Meeting' : '加入Zoom会议'}
                    </span>
                  </a>
                  <p className="text-xs mt-1 break-all opacity-70">{msg.zoomLink}</p>
                </div>
              )}
              {msg.type !== 'image' && msg.type !== 'zoom' && (
                <p>{i18n.language === 'en' ? msg.text : msg.textZh}</p>
              )}
              <p className={`text-xs mt-1 ${
                msg.sender === 'student' ? 'opacity-70' : 'text-gray-500'
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
          <input
            type="text"
            value={zoomLinkInput}
            onChange={(e) => setZoomLinkInput(e.target.value)}
            placeholder={i18n.language === 'en' ? 'Enter Zoom meeting link...' : '输入Zoom会议链接...'}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && zoomLinkInput.trim()) {
                handleSendZoomLink(zoomLinkInput);
                setZoomLinkInput('');
              }
            }}
            className="flex-1 input-field text-sm"
          />
          <button
            onClick={() => {
              if (zoomLinkInput.trim()) {
                handleSendZoomLink(zoomLinkInput);
                setZoomLinkInput('');
              }
            }}
            disabled={!zoomLinkInput.trim()}
            className="btn-primary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowZoomInput(false);
              setZoomLinkInput('');
            }}
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
