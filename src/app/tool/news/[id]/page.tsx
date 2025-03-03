'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function NewDetailPage() {
    const [news, setNews] = useState<any[]>([])
    const param = useParams()
    const [timeStamp, setTimeStamp] = useState(decodeURIComponent(Array.isArray(param.id) ? param.id[0] : param.id))
    const [targetNews, setTargetNews] = useState(null)

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
            <div>
            </div>
        </>
    )
}