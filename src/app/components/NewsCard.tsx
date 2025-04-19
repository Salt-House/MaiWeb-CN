import Link from "next/link";
import { FaCalendarAlt, FaUser, FaLink } from 'react-icons/fa';

interface NewsCardProps {
  title: string;
  content: string;
  image_url: string;
  source: string;
  source_url: string;
  source_author: string;
  source_created_at: string;
  size?: 'sm' | 'mid'; // 添加尺寸属性
}

export default function NewsCard({
  title,
  content,
  image_url,
  source,
  source_url,
  source_author,
  source_created_at,
  size = 'mid'
}: NewsCardProps) {
  // 响应式尺寸设置
  const cardWidth = size === 'sm' 
    ? 'max-sm:w-[360px] w-[520px]' 
    : 'w-full';
  const imageHeight = 'pb-[56.25%]';
  const titleSize = size === 'sm' 
    ? 'max-sm:text-base text-lg' 
    : 'text-xl';
  const padding = size === 'sm' 
    ? 'max-sm:p-2 p-3' 
    : 'p-4';

  return (
    <div className={`${cardWidth} bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}>
      <Link href={`/tool/news/${source_created_at}`} className="block relative">
        <div className={`relative w-full ${imageHeight} overflow-hidden`}>
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            src={image_url}
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-full mb-2">
              {source}
            </span>
            <h2 className={`${titleSize} font-bold text-white line-clamp-2`}>{title}</h2>
          </div>
        </div>
      </Link>

      <div className={padding}>
        <div className="flex max-sm:flex-col sm:items-center text-sm text-gray-500 max-sm:space-y-2 sm:space-x-4 mb-3">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            <span>{new Date(source_created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span className="truncate">{source_author}</span>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <a
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-500 hover:text-purple-700 transition-colors"
          >
            <FaLink className="mr-1" />
            <span>原文链接</span>
          </a>
        </div>
      </div>
    </div>
  );
}