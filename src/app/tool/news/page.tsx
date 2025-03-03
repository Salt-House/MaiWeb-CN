'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

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
    let nowLocate = 0
    const textShadow = { textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)' }
    const getNews = async (limit: number, offset: number): Promise<NewsProps[]> => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        try {
            const response = await fetch(`http://dev.maimai.moe/api//maimai/maiweb/news?limit=${limit}&offset=${offset}`, requestOptions);
            const result = await response.text();
            const data = JSON.parse(result);
            console.log(data.length)
            nowLocate += data.length;
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    useEffect(() => {
        getNews(10, nowLocate).then(data => setNews(data));
    }, [])
    const LoadingMore = () => {
        console.log("Pushing more news")
        const temp = news;
        getNews(10, nowLocate).then(data => temp.push(...data));
        setNews(temp);
    }
    useEffect(() => {
        localStorage.setItem('mainews', JSON.stringify(news))
        console.log(news.length)
    }, [news])



    return (
        <>
            <div className="w-[900px] h-[700px] mt-16 mx-auto space-y-10">
                {news.map((item, index) => (
                    <div key={index} className="relative z-[2] flex flex-col p-5 bg-blue-500 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <h1 className="font-bold text-xl mb-2 tracking-wide" style={textShadow}>{item.title}</h1>
                        {/* <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p> */}
                        <Link href={`/tool/news/${item.source_created_at}`}>
                        <img className="w-[860px] h-[480px] object-cover border-4 border-white" src={item.image_url} alt={item.title} />
                        </Link>
                        <div className="raltive w-full mb-6">
                            <p className="absolute left-5">来源:{item.source}</p>
                            <a className="absolute right-5 hover:text-yellow-500 transition-all duration-300 ease-in-out" href={item.source_url}>源链接</a>
                        </div>
                        <p>平台账号:{item.source_author}</p>
                        <p>{item.source_created_at}</p>
                        <div className="absolute inset-0 z-[-1] bg-[url('/img/bg_shines.png')]">
                        </div>
                    </div>
                ))}
                <button className="text-black" onClick={LoadingMore}>加载更多</button>
            </div>
        </>
    )
}