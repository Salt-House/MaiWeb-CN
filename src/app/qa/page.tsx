"use client";

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PageTransitionWrapper from '../components/PageTransitionWrapper';

interface QAItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const qaData: QAItem[] = [
  {
    id: 1,
    question: "注册账户失败",
    answer: `请您更换邮箱或者用户名，部分邮箱和用户名会导致误判用户已存在。我们会在后续上线用户名和邮箱更改功能。如果您持续注册失败，
    可以通过将注册信息发送至e2544733@outlook.com，我们将手动注册，通过后续开放的修改密码功能更改密码。注意：持续注册失败为偶发性事件，目前发生概率为0.2%并在持续降低。
    我们正在全力排查问题原因。`,
    category: "账户相关"
  },
  {
    id: 2,
    question: "我已经绑定了水鱼，为什么无法正常使用？",
    answer: `请检查您的水鱼名字中是否有空格。有空格情况下请您更改水鱼账号的名字后重新绑定，或者等待我们6月27号之后的更新修复这个问题。
    如果您的名字中无空格且依旧无法正常使用，请尝试重新绑定水鱼账号。如果问题依旧存在，请通过客服支持联系我们`,
    category: "账户相关"
  },
  {
    id: 3,
    question: "我应该如何选择绑定账号",
    answer: `目前绑定水鱼和落雪的账号，仅支持查询成绩与B50。如果您想使用其他功能均需要神秘二维码。`,
    category: "账户相关"
  },
  {
    id: 4,
    question: "我已经绑定落雪和神秘二维码，为什么不能自动更新",
    answer: `由于落雪查分器的限制，落雪账户在第一次使用时必须手动上传一次成绩，之后才能自动更新。`,
    category: "账户相关"
  },
  {
    id: 5,
    question: "如何联系技术支持？",
    answer: "您可以通过以下方式联系技术支持：1) 闲聊群反馈：734304941；2) 联系开发者：2544733927；3) 发送邮件：e2544733@outlook.com",
    category: "客服支持"
  }
];

const categories = ["全部", "账户相关", "客服支持"];

export default function QAPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredQA = selectedCategory === "全部"
    ? qaData
    : qaData.filter(item => item.category === selectedCategory);

  return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              常见问题
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              在这里找到您关心的问题答案，如果没有找到您需要的信息，请随时联系我们的客服团队
            </p>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* QA列表 */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredQA.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                          {item.question}
                        </h3>
                      </div>
                      <div className="ml-4">
                        {expandedItems.includes(item.id) ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expandedItems.includes(item.id) && (
                    <div className="px-6 pb-5">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 联系我们卡片 */}
          {/* <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">没有找到您要的答案？</h2>
            <p className="text-blue-100 mb-6">
              我们的客服团队随时为您提供帮助，请不要犹豫联系我们
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors">
                发送邮件
              </button>
            </div>
          </div>
        </div> */}
        </div>
      </div>
  );
}