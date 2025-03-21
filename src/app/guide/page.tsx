'use client'

import { FaTools } from "react-icons/fa"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import LoadingSpinner from "../components/LoadingSpinner"

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

export interface Guide {
  id: number,
  title: string,
  level: string,
  content: string,
  author: {
    id: number,
    username: string,
    privileges: number
  },
  created_at: string
}

export default function RegionPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [limit, setLimit] = useState(100)
  const [offset, setOffset] = useState(0)
  const textstroke = {
    textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
  };

  const GetGuides = (limit: number, offset: number) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(`https://dev.maimai.moe/api/tutorial?limit=${limit}&offset=${offset}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result)
        setGuides(data)
        setOffset(limit)
        setLimit(limit + 100)
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    GetGuides(limit, offset)
  }, [])

  return (
    <>
      <div className="w-[900px] mx-auto flex flex-col justify-center space-y-5 items-center p-5">
        <p className="text-3xl font-bold text-white mb-10" style={textstroke}>教学</p>
        {guides != null ? <>
          {guides.map((guide, index) => (
            <>
              <Link href={`/guide/${guide.id}`} key={index} className="relative w-[700px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105  transition-all duration-300 ease-in-out">
                <p className="absolute top-5 right-5 text-xl font-bold text-blue-500">{guide.level}</p>
                <h2 className="text-2xl font-bold mb-4 text-purple-800">
                  {guide.title}
                </h2>
                <div className="text-sm flex space-x-4 text-gray-500 mb-4">
                  <p>{new Date(guide.created_at).toLocaleString()}</p>
                  <p>作者:{guide.author.username}</p>
                </div>
              </Link>
            </>
          ))}
        </> :
          <>
            <LoadingSpinner size="sm" />
          </>
        }
      </div>
    </>
  )
}