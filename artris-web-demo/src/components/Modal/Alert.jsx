import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Alert({ isOpen, onClose, type = 'info', title, message, details, onConfirm }) {
  const { i18n } = useTranslation();
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      text: 'text-yellow-700',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Alert Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100`}
            >
              {/* Content */}
              <div className={`${colorScheme.bg} border-b ${colorScheme.border} p-6`}>
                <div className="flex items-start space-x-4">
                  <Icon className={`w-8 h-8 ${colorScheme.icon} flex-shrink-0`} />
                  <div className="flex-1">
                    {title && (
                      <h3 className={`font-bold text-lg mb-2 ${colorScheme.title}`}>
                        {title}
                      </h3>
                    )}
                    <p className={`${colorScheme.text}`}>{message}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className={`w-5 h-5 ${colorScheme.icon}`} />
                  </button>
                </div>
              </div>

              {/* Details */}
              {details && (
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="space-y-3">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-gray-500 font-medium min-w-[100px] text-sm">
                          {detail.label}:
                        </span>
                        {detail.link ? (
                          <a
                            href={detail.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 hover:underline break-all text-sm flex items-center space-x-1"
                          >
                            <span>{detail.value}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-700 text-sm">{detail.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex justify-end space-x-3">
                {!onConfirm && (
                  <button
                    onClick={onClose}
                    className={`px-6 py-2 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${colorScheme.button}`}
                  >
                    {i18n.language === 'en' ? 'OK' : '确定'}
                  </button>
                )}
                {onConfirm && (
                  <>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                      {i18n.language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button
                      onClick={handleConfirm}
                      className={`px-6 py-2 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${colorScheme.button}`}
                    >
                      {i18n.language === 'en' ? 'Confirm' : '确认'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
