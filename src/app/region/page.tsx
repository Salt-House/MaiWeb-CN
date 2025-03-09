'use client'

import { FaTools } from "react-icons/fa"

export default function RegionPage() {
  return (
    <>
      <div className="flex justify-center items-center mt-32">
        <div className="flex flex-col items-center gap-4 p-6 bg-yellow-100 rounded-lg max-w-lg">
          <div className="flex items-center gap-2">
            <FaTools className="text-2xl text-yellow-600" />
            <span className="text-yellow-700 font-semibold text-lg">开发进行中</span>
          </div>
          <div className="text-yellow-700 text-center">
            <p className="mb-2">该页面正在开发中，我们正在努力为您打造更好的舞萌区域功能。</p>
            <p className="mb-2">即将推出的功能：</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>各区域基本信息</li>
              <li>区域伙伴</li>
              <li>区域跑图一览</li>
            </ul>
            <p className="mt-3 text-sm text-yellow-600">预计完成时间：2025年第一季度</p>
          </div>
        </div>
      </div>
    </>
  )
}