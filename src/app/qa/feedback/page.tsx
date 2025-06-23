'use client'

import { useState } from 'react'

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    contact: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const sendmail = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "category": formData.category,
      "title": formData.title,
      "desc": formData.description,
      "priority": formData.priority,
      "contact": formData.contact
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch("https://dev.maimai.moe/email/sendbug", requestOptions);
      const result = await response.text();
      
      if (response.ok) {
        console.log('反馈提交成功:', result);
        return true;
      } else {
        throw new Error(result || '提交失败');
      }
    } catch (error) {
      console.error('提交错误:', error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await sendmail()
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">反馈已提交</h2>
            <p className="text-gray-600 mb-6">感谢您的反馈，我们会尽快处理您的问题。</p>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  category: '',
                  title: '',
                  description: '',
                  contact: '',
                  priority: 'medium'
                })
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              提交新反馈
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">问题反馈</h1>
          <p className="text-gray-600">遇到问题或有建议？我们很乐意倾听您的声音</p>
        </div>

        {/* 反馈表单 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-xl font-semibold text-white">填写反馈信息</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* 问题类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                问题类型 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="bug">程序错误</option>
                <option value="feature">功能建议</option>
                <option value="ui">界面问题</option>
                <option value="performance">性能问题</option>
                <option value="other">其他</option>
              </select>
            </div>

            {/* 问题标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                问题标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="请简要描述您遇到的问题"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 详细描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="请详细描述问题的具体情况、复现步骤等..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* 优先级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'low', label: '低', color: 'text-green-600 bg-green-50 border-green-200' },
                  { value: 'medium', label: '中', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
                  { value: 'high', label: '高', color: 'text-red-600 bg-red-50 border-red-200' }
                ].map((priority) => (
                  <label key={priority.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`px-4 py-2 rounded-lg border-2 transition-all ${formData.priority === priority.value
                      ? priority.color
                      : 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                      {priority.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系方式（可选）
              </label>
              <input
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="您的邮箱地址（用于跟进问题处理进度）"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 提交按钮 */}
            <div className="pt-4">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-red-700 text-sm">{submitError}</span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    正在提交反馈...
                  </div>
                ) : (
                  '提交反馈'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            我们承诺保护您的隐私，反馈信息仅用于问题处理和产品改进
          </p>
        </div>
      </div>
    </div>
  )
}