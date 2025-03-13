'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

interface Guide {
  title: string
  content: string
  createTime: string
}

export default function GuideListPage() {
  const [guides, setGuides] = useState<Guide[]>([])

  useEffect(() => {
    const savedGuides = JSON.parse(localStorage.getItem('guides') || '[]')
    setGuides(savedGuides)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white" 
            style={{
              textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
            }}>
          文稿列表
        </h1>
        <Link 
          href="/guide/add"
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          新建文稿
        </Link>
      </div>

      <div className="space-y-6">
        {guides.map((guide, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">{guide.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              创建时间：{new Date(guide.createTime).toLocaleString()}
            </div>
            <div className="prose max-w-none">
              <ReactQuill
                value={guide.content}
                readOnly={true}
                theme="bubble"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}