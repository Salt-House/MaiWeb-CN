'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <LoadingSpinner size="sm" message="加载编辑器..." />
})

export default function AddGuidePage() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const saveContent = () => {
    if (!title.trim()) {
      alert('请输入标题')
      return
    }
    if (!content.trim()) {
      alert('请输入内容')
      return
    }
    
    const guideData = {
      title,
      content,
      createTime: new Date().toISOString()
    }
    
    // 保存到 localStorage
    const guides = JSON.parse(localStorage.getItem('guides') || '[]')
    guides.push(guideData)
    localStorage.setItem('guides', JSON.stringify(guides))
    
    alert('保存成功')
    window.location.href = '/guide/preview'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6" 
            style={{
              textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
            }}>
          创建文稿
        </h1>
        <input
          type="text"
          placeholder="请输入标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className="h-[500px] mb-12"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveContent}
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          保存文稿
        </button>
      </div>
    </div>
  )
}