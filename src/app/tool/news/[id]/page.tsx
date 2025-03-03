'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function NewDetailPage() {
    const [news, setNews] = useState<any[]>([])
    const param = useParams()
    const [timeStamp, setTimeStamp] = useState(decodeURIComponent(Array.isArray(param.id) ? param.id[0] : param.id))
    const [targetNews, setTargetNews] = useState<{
        title: string,
        content: string,
        image_url: string,
        source: string,
        source_url: string,
        source_author: string,
        source_created_at: string
    } | null>(null)
    const textstroke = {
        textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
    };

    useEffect(() => {
        let temp = '';
        temp = localStorage.getItem('mainews') || '';
        console.log(temp)
        if (temp) {
            setNews(JSON.parse(temp))
        } else {
            alert('No news found')
        }
        console.log(timeStamp)
    }, [])

    useEffect(() => {
        if (news.length === 0) return;
        console.log(news)
        setTargetNews(news.find((item) => item.source_created_at === timeStamp))

    }, [news])
    useEffect(() => {
        console.log(targetNews)
    }, [targetNews])
    return (
        <>
            <div className="mx-auto flex flex-col justify-center items-center space-x-10 mt-16 w-[1200px] h-[800p] p-5 overflow-auto">
                <Link href={'/tool/news'} className="text-xl text-white font-bold hover:border-b-4 border-purple-500 hover:scale-105 transition-all duration-300 ease-in-out" style={textstroke}>返回资讯页</Link>
                <div className="w-[600px] h-[900px] bg-cover bg-no-repeat bg-[url(/img/main_bg.png)] p-5 px-10 pt-10">
                    <h1 className="text-2xl text-black font-bold ">{targetNews?.title}</h1>
                    <h1 className="text-black mb-12">作者:{targetNews?.source_author}<a className="pl-2 text-blue-500 hover:underline" href={targetNews?.source_url}>源链接</a></h1>
                    <p className="text-black mb-5">{targetNews?.content}</p>
                    <img src={targetNews?.image_url} alt="" />
                </div>
            </div>
        </>
    )
}