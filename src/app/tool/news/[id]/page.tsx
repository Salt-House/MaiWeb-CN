"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import {
  FaCalendarAlt,
  FaUser,
  FaLink,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface NewsItem {
  title: string
  content: string
  image_url: string
  source: string
  source_url: string
  source_author: string
  source_created_at: string
}

export default function NewDetailPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const param = useParams()
  const [timeStamp, setTimeStamp] = useState(
    decodeURIComponent(Array.isArray(param.id) ? param.id[0] : param.id || "")
  )
  const [targetNews, setTargetNews] = useState<NewsItem | null>(null)

  // 添加图片数组和当前图片索引状态
  const [images, setImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const textShadow = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }

  useEffect(() => {
    let temp = ""
    temp = localStorage.getItem("mainews") || ""
    console.log(temp)
    if (temp) {
      setTimeout(() => setNews(JSON.parse(temp)), 0)
    } else {
      alert("No news found")
    }
    console.log(timeStamp)
  }, [timeStamp])

  useEffect(() => {
    if (news.length === 0) return
    console.log(news)
    const foundNews = news.find(item => item.source_created_at === timeStamp)
    setTimeout(() => setTargetNews(foundNews || null), 0)

    // MARK: - 预留多图片处理
    // 处理图片数组
    if (foundNews) {
      // 假设图片URL可能在content中以某种格式存在，这里我们先添加主图片
      const imageArray = [foundNews.image_url]

      // 这里可以添加从content中提取其他图片的逻辑
      // 例如，如果content中包含图片链接，可以通过正则表达式提取
      const imgRegex = /https?:\/\/\S+\.(jpg|jpeg|png|gif|webp)/gi
      const contentImages = foundNews.content.match(imgRegex) || []

      // 过滤掉与主图片相同的URL
      const uniqueContentImages = contentImages.filter((img: string) => img !== foundNews.image_url)

      setTimeout(() => setImages([...imageArray, ...uniqueContentImages]), 0)
    }
  }, [news, timeStamp])

  // 切换到上一张图片
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // 切换到下一张图片
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/tool/news"
            className="inline-flex items-center text-white hover:scale-105 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-xl font-bold" style={textShadow}>
              返回资讯列表
            </span>
          </Link>
          {/* <div className="text-3xl font-bold text-white" style={textShadow}>
            资讯详情
          </div> */}
          <div className="w-[150px]"></div>
        </div>

        {targetNews ? (
          <div className="relative">
            <div className="border-4 border-white bg-white rounded-2xl">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border-4 border-[rgb(155,244,236)]">
                {/* 图片展示区域，添加左右切换按钮 */}
                <div className="relative">
                  {images.length > 0 && (
                    <>
                      {/* TODO 优化：启用 `sizes` 与 `priority` 以提升首屏加载 */}
                      <div className="relative w-full h-[600px]">
                        <Image
                          src={images[currentImageIndex]}
                          alt={`${targetNews.title} - 图片 ${currentImageIndex + 1}`}
                          className="object-contain"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={currentImageIndex === 0}
                          unoptimized={true} // 如果图片来自外部且未在 next.config.js 配置，可能需要这个，或者建议用户配置
                        />
                      </div>

                      {/* 图片计数器 */}
                      {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      )}

                      {/* 左右切换按钮，仅当有多张图片时显示 */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-3 transition-all"
                            aria-label="上一张图片"
                          >
                            <FaChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-3 transition-all"
                            aria-label="下一张图片"
                          >
                            <FaChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full mb-3">
                      {targetNews.source}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{targetNews.title}</h1>
                  </div>

                  <div className="flex items-center text-gray-600 space-x-6 mb-6 border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <span>{new Date(targetNews.source_created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      <span>{targetNews.source_author}</span>
                    </div>
                    <a
                      href={targetNews.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:text-blue-700 transition-colors ml-auto"
                    >
                      <FaLink className="mr-2" />
                      <span>原文链接</span>
                    </a>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {/* TODO 安全：后端返回的富文本需进行 XSS 处理；前端渲染富文本时避免直接拼接，使用安全渲染组件 */}
                    {targetNews.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-800">
                        {paragraph}
                      </p>
                    ))}

                    {/* 添加转载授权说明 */}
                    <p className="mt-8 text-sm text-gray-500 italic border-t pt-4">
                      *转载已经过原博主/up主授权
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-4 border-white rounded-2xl">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl border-4 border-[rgb(155,244,236)]">
              <LoadingSpinner size="md" message="正在获取新闻内容，请稍候" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
