import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO, isValid } from 'date-fns';

// Helper function to safely convert timestamp to Date
const safeDate = (timestamp) => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') {
    const parsed = parseISO(timestamp);
    return isValid(parsed) ? parsed : new Date(timestamp);
  }
  return new Date(timestamp);
};

// Helper function to safely format date
const safeFormat = (timestamp, formatStr) => {
  try {
    const date = safeDate(timestamp);
    return isValid(date) ? format(date, formatStr) : '';
  } catch (e) {
    return '';
  }
};

// Mock support agent
const supportAgent = {
  name: 'Artris Support',
  nameZh: 'Artris 客服',
  avatar: 'https://i.pravatar.cc/150?img=47',
  isOnline: true,
};

// Auto-reply messages based on keywords
const getAutoReply = (message, language) => {
  if (!message) {
    return language === 'en'
      ? 'Thank you for your message! How can I help you?'
      : '感谢您的消息！请问有什么可以帮助您的吗？';
  }
  
  const msg = message.toLowerCase().trim();
  
  // Greeting responses
  if (msg.includes('hello') || msg.includes('hi') || msg === 'hey' || msg.includes('你好') || msg === '你好') {
    return language === 'en' 
      ? 'Hello! Welcome to Artris. How can I help you today?'
      : '您好！欢迎来到Artris。请问有什么可以帮助您的吗？';
  }
  
  // Booking related
  if (msg.includes('booking') || msg.includes('预约') || msg.includes('book') || msg.includes('appointment') || msg.includes('session')) {
    return language === 'en'
      ? 'To book a session, go to the Mentors page, select a mentor, and click "Book Session". Need more help?'
      : '要预约课程，请前往导师页面，选择导师，然后点击"预约课程"。需要更多帮助吗？';
  }
  
  // Payment related
  if (msg.includes('payment') || msg.includes('支付') || msg.includes('pay') || msg.includes('card') || msg.includes('credit') || msg.includes('fee') || msg.includes('price')) {
    return language === 'en'
      ? 'We accept major credit cards, debit cards, and PayPal. All payments are secure and encrypted. You can complete payment during the booking process.'
      : '我们接受主要信用卡、借记卡和PayPal。所有支付都是安全加密的。您可以在预约过程中完成支付。';
  }
  
  // Cancellation related
  if (msg.includes('cancel') || msg.includes('取消') || msg.includes('reschedule') || msg.includes('refund')) {
    return language === 'en'
      ? 'You can cancel or reschedule sessions through the My Appointments page. Cancellation policies may vary depending on the mentor and timing of your request.'
      : '您可以通过"我的预约"页面取消或改期课程。取消政策可能因导师和您提出请求的时间而异。';
  }
  
  // Portfolio related
  if (msg.includes('portfolio') || msg.includes('作品集') || msg.includes('work') || msg.includes('作品')) {
    return language === 'en'
      ? 'You can upload and manage your portfolio in the Profile section under "My Portfolio". You can add images and PDFs to showcase your work.'
      : '您可以在个人资料页面的"我的作品集"部分上传和管理您的作品集。您可以添加图片和PDF来展示您的作品。';
  }
  
  // Help/Support related
  if (msg.includes('help') || msg.includes('帮助') || msg.includes('support') || msg.includes('support') || msg.includes('问题')) {
    return language === 'en'
      ? 'I\'m here to help! You can ask me about bookings, payments, portfolios, or any other questions about Artris. What would you like to know?'
      : '我很乐意为您提供帮助！您可以问我关于预约、支付、作品集或Artris的任何其他问题。您想了解什么？';
  }
  
  // Default response
  return language === 'en'
    ? 'Thank you for your message! Our support team will get back to you shortly. Is there anything else I can help with?'
    : '感谢您的消息！我们的支持团队会尽快回复您。还有其他我可以帮助的吗？';
};

export default function LiveChat() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('livechat_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map(msg => ({
          ...msg,
          timestamp: safeDate(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Error parsing saved messages:', e);
        // Initialize with greeting if parsing fails
        const greeting = {
          id: 'greeting-1',
          sender: 'agent',
          text: 'Hello! Welcome to Artris. How can I help you today?',
          textZh: '您好！欢迎来到Artris。请问有什么可以帮助您的吗？',
          timestamp: new Date(),
        };
        setMessages([greeting]);
      }
    } else {
      // Initial greeting
      const greeting = {
        id: 'greeting-1',
        sender: 'agent',
        text: 'Hello! Welcome to Artris. How can I help you today?',
        textZh: '您好！欢迎来到Artris。请问有什么可以帮助您的吗？',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, []); // Remove i18n.language dependency to prevent re-initialization on language change

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const currentInput = inputMessage.trim();
    const currentLanguage = i18n.language;
    
    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: currentInput,
      textZh: currentInput,
      timestamp: new Date(),
    };

    setInputMessage('');
    setIsTyping(true);

    // Use functional update to ensure we have the latest messages
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      localStorage.setItem('livechat_messages', JSON.stringify(updatedMessages));

      // Simulate agent typing and response
      setTimeout(() => {
        setIsTyping(false);
        const agentResponse = {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          text: getAutoReply(currentInput, 'en'),
          textZh: getAutoReply(currentInput, 'zh'),
          timestamp: new Date(),
        };
        
        setMessages(prevMsgs => {
          const finalMessages = [...prevMsgs, agentResponse];
          localStorage.setItem('livechat_messages', JSON.stringify(finalMessages));
          return finalMessages;
        });
      }, 1500);

      return updatedMessages;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center z-50 group"
            aria-label={i18n.language === 'en' ? 'Open chat' : '打开聊天'}
          >
            <MessageCircle className="w-6 h-6" />
            {supportAgent.isOnline && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
            )}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: isMinimized ? 0 : 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col ${
              isMinimized ? 'h-auto' : 'h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={supportAgent.avatar}
                    alt={supportAgent.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {supportAgent.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-600"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {i18n.language === 'en' ? supportAgent.name : supportAgent.nameZh}
                  </h3>
                  <p className="text-xs text-primary-100">
                    {supportAgent.isOnline 
                      ? (i18n.language === 'en' ? 'Online' : '在线')
                      : (i18n.language === 'en' ? 'Offline' : '离线')
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-primary-700 rounded transition-colors"
                  aria-label={i18n.language === 'en' ? 'Minimize' : '最小化'}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-primary-700 rounded transition-colors"
                  aria-label={i18n.language === 'en' ? 'Close' : '关闭'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === 'user' 
                            ? 'bg-primary-600' 
                            : 'bg-gray-200'
                        }`}>
                          {msg.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.sender === 'user' 
                              ? msg.text // User messages are always in the language they typed
                              : (i18n.language === 'en' ? (msg.text || msg.textZh) : (msg.textZh || msg.text))
                            }
                          </p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'user' 
                              ? 'text-primary-100' 
                              : 'text-gray-500'
                          }`}>
                            {safeFormat(msg.timestamp, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={i18n.language === 'en' ? 'Type a message...' : '输入消息...'}
                      className="flex-1 input-field text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {i18n.language === 'en' 
                      ? 'Press Enter to send' 
                      : '按Enter发送'}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
