"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { IoInformationCircle } from 'react-icons/io5';

interface NoticeProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
  onClose?: () => void;
  duration?: number; // 自动关闭的时间（毫秒），如不设置则不自动关闭
}

const Notice: React.FC<NoticeProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration,
}) => {
  // 自动关闭逻辑
  useEffect(() => {
    if (isVisible && duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // 不同类型通知的样式
  const typeStyles = {
    info: 'bg-blue-50 border-blue-300 text-blue-700',
    success: 'bg-green-50 border-green-300 text-green-700',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    error: 'bg-red-50 border-red-300 text-red-700',
  };

  // 不同类型通知的图标
  const icons = {
    info: <IoInformationCircle className="h-5 w-5 text-blue-500" />,
    success: <IoInformationCircle className="h-5 w-5 text-green-500" />,
    warning: <IoInformationCircle className="h-5 w-5 text-yellow-500" />,
    error: <IoInformationCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border-l-4 px-4 py-3 shadow-lg ${typeStyles[type]}`}
          role="alert"
        >
          <div className="flex items-center">
            <div className="mr-3">{icons[type]}</div>
            <div className="flex-1 text-sm font-medium">{message}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto rounded-md p-1 hover:bg-gray-200 hover:bg-opacity-50 transition-colors focus:outline-none"
                aria-label="关闭"
              >
                <IoMdClose className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 示例用法
export const NoticeExample: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  
  return (
    <div>
      <button 
        onClick={() => setShowNotice(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        显示通知
      </button>
      
      <Notice 
        message="这是一条重要通知信息，请注意查看！"
        type="info"
        isVisible={showNotice}
        onClose={() => setShowNotice(false)}
        duration={5000} // 5秒后自动关闭
      />
    </div>
  );
};

export default Notice;
