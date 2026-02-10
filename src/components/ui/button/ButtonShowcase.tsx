"use client"

import React from "react"
import Button from "./Button"
import { FaPlay, FaHeart, FaDownload, FaSearch, FaUser, FaArrowRight } from "react-icons/fa"

const ButtonShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">按钮组件展示</h1>

        {/* 基础变体 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">基础变体</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="accent">强调按钮</Button>
            <Button variant="gradient">渐变按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
          </div>
        </section>

        {/* 不同尺寸 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">尺寸变体</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm" variant="primary">
              小按钮
            </Button>
            <Button size="md" variant="primary">
              中按钮
            </Button>
            <Button size="lg" variant="primary">
              大按钮
            </Button>
            <Button size="xl" variant="primary">
              超大按钮
            </Button>
          </div>
        </section>

        {/* 带图标 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">带图标按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="gradient" leftIcon={<FaPlay />}>
              播放音乐
            </Button>
            <Button variant="accent" rightIcon={<FaHeart />}>
              收藏
            </Button>
            <Button variant="secondary" leftIcon={<FaDownload />} rightIcon={<FaArrowRight />}>
              下载文件
            </Button>
            <Button variant="outline" leftIcon={<FaSearch />}>
              搜索
            </Button>
            <Button variant="primary" leftIcon={<FaUser />}>
              个人中心
            </Button>
          </div>
        </section>

        {/* 圆形按钮 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">圆形按钮</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" rounded>
              圆形主要
            </Button>
            <Button variant="gradient" rounded>
              圆形渐变
            </Button>
            <Button variant="accent" rounded leftIcon={<FaHeart />}>
              圆形收藏
            </Button>
          </div>
        </section>

        {/* 状态变体 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">状态变体</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" loading>
              加载中...
            </Button>
            <Button variant="secondary" disabled>
              禁用状态
            </Button>
            <Button variant="gradient" onClick={() => alert("按钮被点击了！")}>
              点击我
            </Button>
          </div>
        </section>

        {/* maimai 风格示例 */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">maimai 游戏风格示例</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="gradient"
              size="lg"
              rounded
              leftIcon={<FaPlay />}
              className="font-bold shadow-xl shadow-purple-500/30"
            >
              开始游戏
            </Button>
            <Button variant="accent" size="lg" leftIcon={<FaSearch />} className="font-bold">
              查找乐曲
            </Button>
            <Button variant="primary" size="lg" rightIcon={<FaArrowRight />} className="font-bold">
              查看成绩
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ButtonShowcase
