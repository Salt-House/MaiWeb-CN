"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import http from "@/services/request"
import { CONFIG } from "@/config/api"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Image from "next/image"

interface BlogAuthor {
  login: string
  avatar_url: string
}

interface BlogEntry {
  title: string
  date: string
  author: BlogAuthor
  content: string
  label: string[]
}

interface BlogResponse {
  blogs: BlogEntry[]
}

/**
 * 更新日志页面组件
 * 获取并展示GitHub更新日志
 * @returns JSX.Element 页面组件
 */
export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await http.post<BlogResponse>(CONFIG.API.ENDPOINTS.BLOG)
        setBlogs(res.blogs)
      } catch (err) {
        console.error("Failed to fetch blogs:", err)
        setError("获取更新日志失败，请稍后重试")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center text-red-500 bg-white p-8 rounded-xl shadow-sm">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">更新日志</h1>
          <p className="text-gray-500">查看最新的功能更新与改进</p>
        </motion.div>

        <div className="space-y-6">
          {blogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 博客卡片组件
 * 展示单条更新日志详情
 * @param props 组件属性
 * @param props.blog 日志数据
 * @param props.index 索引，用于动画延迟
 * @returns JSX.Element 卡片组件
 */
function BlogCard({ blog, index }: { blog: BlogEntry; index: number }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Parse content to handle bullet points
  const renderContent = (content: string) => {
    if (!content) return null
    const lines = content.split(/\r?\n/)
    return (
      <ul className="space-y-2 text-gray-700 mt-4">
        {lines.map((line, i) => {
          const cleanLine = line.replace(/^- /, "").trim()
          if (!cleanLine) return null
          return (
            <li key={i} className="flex items-start">
              <span className="mr-2 text-pink-400 mt-1.5">•</span>
              <span>{cleanLine}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {blog.title}
            </h2>
            <div className="flex items-center mt-3">
              <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 ring-2 ring-gray-100">
                <Image
                  src={blog.author.avatar_url}
                  alt={blog.author.login}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {blog.author.login}
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <time className="text-sm text-gray-500">
                {formatDate(blog.date)}
              </time>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {blog.label.map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  tag === "enhancement" || tag === "feature"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : tag === "bug" || tag === "fix"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-gray-50 text-gray-600 border border-gray-100"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pl-1 border-l-4 border-pink-100">
          <div className="pl-4 max-w-none">
            {renderContent(blog.content)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
