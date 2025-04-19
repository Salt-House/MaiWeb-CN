'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import ActionButton from "@/app/components/ActionButton"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import NewsCard from "@/app/components/NewsCard"
import { FaCalendarAlt, FaUser, FaLink } from 'react-icons/fa'

interface NewsProps {
  title: string,
  content: string,
  image_url: string,
  source: string,
  source_url: string,
  source_author: string,
  source_created_at: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsProps[]>([])
  const [nowLocate, setNowLocate] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const textShadow = { textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)' }

  const getNews = async (limit: number, offset: number): Promise<NewsProps[]> => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(`https://dev.maimai.moe/api/maimai/maiweb/news?limit=${limit}&offset=${offset}`, requestOptions);
      const result = await response.text();
      const data = JSON.parse(result);
      console.log("获取到新闻数量:", data.length);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    setIsLoading(true)
    getNews(10, 0).then(data => {
      setNews(data);
      setNowLocate(data.length);
      setHasMore(data.length === 10); // 如果返回的数据少于请求的数量，说明没有更多数据了
      setIsLoading(false);
    });
  }, [])

  const LoadingMore = async () => {
    console.log("加载更多新闻, 当前位置:", nowLocate);
    setIsLoading(true);
    try {
      const newData = await getNews(10, nowLocate);
      if (newData.length > 0) {
        setNews(prevNews => [...prevNews, ...newData]);
        setNowLocate(prevLocate => prevLocate + newData.length);
        setHasMore(newData.length === 10); // 如果返回的数据少于请求的数量，说明没有更多数据了
      } else {
        setHasMore(false);
        console.log("没有更多新闻了");
      }
    } catch (error) {
      console.error("加载更多新闻失败:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    localStorage.setItem('mainews', JSON.stringify(news))
    console.log("当前新闻总数:", news.length)
  }, [news])



  return (
    <>
      {/* 添加独立的标题区域 */}
      <div className="relative flex flex-col justify-center items-center mt-10 mb-10 text-black">
        <div className="w-48 h-20 text-3xl font-bold text-white flex justify-center items-center" style={textShadow}>
          新闻资讯
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              content={item.content}
              image_url={item.image_url}
              source={item.source}
              source_url={item.source_url}
              source_author={item.source_author}
              source_created_at={item.source_created_at}
            />
          ))}
        </div>

        <div className="flex justify-center items-center py-12">
          {isLoading ? (
            <LoadingSpinner size="sm" message="加载中..." />
          ) : hasMore ? (
            <ActionButton onClick={LoadingMore}>加载更多</ActionButton>
          ) : (
            <p className="text-gray-500 text-lg">——— 没有更多新闻了 ———</p>
          )}
        </div>
      </div>
    </>
  )
}