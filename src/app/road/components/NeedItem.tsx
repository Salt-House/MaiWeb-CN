"use client"

import { useState } from "react"
import { addRoadComment, addRoadStar } from "@/utils/need"

interface NeedComment {
  id: number
  role: string
  content: string
  uid: number
}

export interface NeedItemProps {
  rid: number
  title: string
  content: string
  star: number
  latestTime: string
  comment: NeedComment[]
  status?: number
  priority?: number
  progress?: number
  tags?: string[]
}

/**
 * NeedItem 组件 - 用于显示开发需求项目
 * @param props - 包含完整需求信息的属性对象
 */
export default function NeedItem(props: NeedItemProps) {
  // 评论相关状态
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(props.comment || [])
  // 爱心点击状态
  const [isLiked, setIsLiked] = useState(false)
  // 本地star数量状态
  const [starCount, setStarCount] = useState(props.star)

  // 状态颜色映射
  const getStatusColor = (status?: number) => {
    switch (status) {
      case 2:
        return "bg-gray-100 text-gray-600 border-gray-300"
      case 1:
        return "bg-blue-100 text-blue-600 border-blue-300"
      case 0:
        return "bg-green-100 text-green-600 border-green-300"
      default:
        return "bg-gray-100 text-gray-600 border-gray-300"
    }
  }

  // 优先级颜色映射
  const getPriorityColor = (priority?: number) => {
    switch (priority) {
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-orange-500"
      case 3:
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  // 状态文本映射
  const getStatusText = (status?: number) => {
    switch (status) {
      case 0:
        return "已完成"
      case 1:
        return "进行中"
      case 2:
        return "评估中"
      default:
        return "未知"
    }
  }

  /**
   * 切换评论区域显示状态
   */
  const toggleComments = () => {
    setShowComments(!showComments)
  }

  /**
   * 添加新评论
   */
  const handleAddComment = async () => {
    if (newComment.trim()) {
      const comment: NeedComment = {
        id: props.rid, // 确保props中包含id
        role: "用户", // 这里可以根据实际登录用户信息设置
        content: newComment.trim(),
        uid: 2, // 临时使用固定uid，实际应该使用真实的用户ID
      }
      try {
        const res = await addRoadComment({
          id: props.rid, // 确保props中包含id
          role: "user",
          comment: newComment.trim(),
          uid: 2, // 临时使用固定uid，实际应该使用真实的用户ID
        })
        const data = JSON.parse(res)
        if (data.success === true) {
          // 根据后端返回的success字段判断
          setComments([...comments, comment])
          setNewComment("")
        } else {
          console.error("添加评论失败:", data.message)
          // 可以添加用户提示，例如弹窗
        }
      } catch (error) {
        console.error("请求评论接口失败:", error)
        // 可以添加用户提示，例如网络错误
      }
    }
  }
  /**
   * 处理回车键提交评论
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="w-full h-auto min-h-[320px] max-w-sm rounded-xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
      {/* 头部区域 */}
      <div className="p-6 pb-4">
        {/* 标题和优先级 */}
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-800 flex-1 pr-3 leading-tight">
            {props.title}
          </h1>
          {props.priority && (
            <div
              className={`w-3 h-3 rounded-full ${getPriorityColor(props.priority)} flex-shrink-0 mt-1`}
              title={`优先级: ${props.priority}`}
            ></div>
          )}
        </div>

        {/* 标签区域 */}
        {props.tags && props.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {props.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-200"
              >
                {tag}
              </span>
            ))}
            {props.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                +{props.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 内容描述 */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{props.content}</p>
      </div>

      {/* 进度条 */}
      {props.progress !== undefined && (
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">进度</span>
            <span className="text-xs text-gray-600 font-medium">{props.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(props.progress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 底部信息区域 */}
      <div className="px-6 pb-6">
        {/* 状态和评论按钮 */}
        <div className="flex items-center justify-between mb-3">
          {props.status !== undefined && (
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(props.status)}`}
            >
              {getStatusText(props.status)}
            </span>
          )}
          <button
            onClick={toggleComments}
            className="text-xs text-gray-500 flex items-center hover:text-blue-600 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            {comments.length} 评论
            <svg
              className={`w-3 h-3 ml-1 transition-transform duration-200 ${showComments ? "rotate-180" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 爱心和时间 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={async () => {
                try {
                  await addRoadStar(props.rid)
                  setIsLiked(!isLiked)
                  setStarCount(starCount + 1)
                } catch (error) {
                  console.error("点赞失败:", error)
                }
              }}
              className="transition-colors duration-200 hover:scale-110 transform"
            >
              <svg
                className={`w-4 h-4 mr-1 transition-colors duration-200 ${
                  isLiked ? "text-red-500" : "text-gray-400"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-gray-600 font-semibold text-sm">{starCount}</span>
          </div>
          <span className="text-xs text-gray-400">{props.latestTime}</span>
        </div>
      </div>

      {/* 评论区域 */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50">
          {/* 评论列表 */}
          {comments.length > 0 && (
            <div className="px-6 py-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">{comment.role}</span>
                      <span className="text-xs text-gray-400">#{comment.uid}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 添加评论表单 */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="添加评论..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  发布评论
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
