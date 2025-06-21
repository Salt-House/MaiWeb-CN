import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

interface DownloadButtonProps {
  url: string;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDownloadStart?: () => void;
  onDownloadEnd?: () => void;
  onError?: (error: Error) => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  filename,
  children = '下载',
  className = '',
  disabled = false,
  onDownloadStart,
  onDownloadEnd,
  onError
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading || disabled) return;

    try {
      setIsDownloading(true);
      onDownloadStart?.();

      // 使用 fetch 获取文件数据（适用于同域或配置了 CORS 的文件）
      const response = await fetch(url);
      if (!response.ok) throw new Error('下载失败');

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // 创建临时链接元素
      const link = document.createElement('a');
      link.href = downloadUrl;

      // 如果提供了文件名，设置 download 属性
      if (filename) {
        link.download = filename;
      }

      // 设置链接不可见并添加到文档
      link.style.display = 'none';
      document.body.appendChild(link);

      // 触发下载
      link.click();

      // 清理临时元素和 URL 对象
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('下载失败:', error);
      onError?.(error as Error);
    } finally {
      setIsDownloading(false);
      onDownloadEnd?.();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={`w-8 h-8 flex items-center justify-center text-white rounded-full transition-colors ${isDownloading ? 'bg-[rgb(107,16,186)]' : 'bg-[rgb(155,90,213)] hover:bg-[rgb(135,70,193)]'} ${className}`}
        title="下载音频"
      >
        {isDownloading ? "..." : <FaDownload />}
      </button>

      {isDownloading && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-[rgba(107,16,186,0.8)] text-white text-xs rounded-md whitespace-nowrap z-10">
          正在下载...
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
