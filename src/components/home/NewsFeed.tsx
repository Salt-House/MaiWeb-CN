"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import NewsCard from "@/components/common/NewsCard"
import { getNews as fetchNews, NewsProps } from "@/services/news"
import { FaArrowRight } from "react-icons/fa"

export default function NewsFeed() {
  const [news, setNews] = useState<NewsProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews(3, 0)
      .then(data => {
        setNews(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <section id="news" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-l-4 border-purple-500 pl-4">
            最新资讯
          </h2>
          <p className="text-gray-500 mt-2 ml-5 text-sm">不错过任何舞萌动态</p>
        </div>
        <Link 
          href="/tool/news" 
          className="group flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors"
        >
          查看全部 
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Simple Skeleton
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))
        ) : (
          news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={index === 0 ? "md:col-span-2 lg:row-span-2" : ""}
            >
              <NewsCard
                {...item}
                size={index === 0 ? "mid" : "sm"}
              />
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}
