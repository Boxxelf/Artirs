import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateMessages } from '../../data/messages';
import { format } from 'date-fns';

export default function Messages() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = generateMessages(user?.id, 'student');
      setMessages(data);
      setLoading(false);
    }, 500);
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('student.messages.title')}</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('student.messages.noMessages')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/student/chat/${msg.mentorId}`)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={msg.mentorAvatar}
                  alt={msg.mentorName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{msg.mentorName}</h3>
                    <span className="text-sm text-gray-500">
                      {format(msg.timestamp, 'MMM d')}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {i18n.language === 'en' ? msg.lastMessage : msg.lastMessageZh}
                  </p>
                </div>
                {msg.unread > 0 && (
                  <div className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {msg.unread}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
