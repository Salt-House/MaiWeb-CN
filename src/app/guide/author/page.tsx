'use client'

import { FaArrowLeft, FaArrowRight, FaTools } from "react-icons/fa"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import LoadingSpinner from "../../components/LoadingSpinner"
import { UserProfile } from "@/app/user/model"

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
const defaultUserProfile: UserProfile = {
    id: "1",
    username: "请刷新",
    email: "请刷新",
    privileges: "basic",
    mai_rating: "0",
    mai_play_count: "0",
    mai_player_name: "Player 1",
    mai_nameplate_id: "1",
    mai_icon_id: "1",
    mai_trophy_id: "1",
    mai_frame_id: ""
};

export default function RegionPage() {
    const [guides, setGuides] = useState<Guide[]>([])
    const [token, setToken] = useState<string>("")
    const [limit, setLimit] = useState(100)
    const [offset, setOffset] = useState(0)
    const [user, setUser] = useState<UserProfile>(defaultUserProfile)
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

        fetch(`https://dev.maimai.moe/api/tutorial?user_id=${user.id}&limit=${limit}&offset=${offset}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const data = JSON.parse(result)
                console.log(data)
                setGuides(data)
                setOffset(limit)
                setLimit(limit + 100)
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        setToken(localStorage.getItem("token") || "")
    }, [])

    useEffect(() => {
        if (token != "") {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            fetch("https://dev.maimai.moe/api/user/me", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result)
                    setUser(data)
                    console.log(data)
                })
                .catch((error) => console.error(error));
        }
    }, [token])

    useEffect(() => {
        if (user.id != "1") {
            GetGuides(limit, offset)
        }
    }, [user.id])

    return (
        <>
            <div className="relative max-sm:w-[420px] w-[900px] mx-auto flex flex-col justify-center space-y-5 items-center p-5">
                <p className="text-3xl font-bold text-white" style={textstroke}>教学</p>
                {guides.length > 0 ? <>
                    {guides.map((guide, index) => (
                        <>
                            <Link href={`/guide/${guide.id}`} key={index} className="relative max-sm:w-[420px] w-[700px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105  transition-all duration-300 ease-in-out">
                                <p className="absolute bottom-5 right-5 text-xl font-bold text-blue-500">{guide.level}</p>
                                <h2 className="text-2xl max-sm:text-xl font-bold mb-4 text-purple-800">
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
                        <div className="relative max-sm:w-[420px] w-[700px] bg-white rounded-lg shadow-lg p-6 text-center">
                            <LoadingSpinner size="sm" message="加载中" description="正在获取创作数据"/>
                        </div>

                    </>
                }
            </div>
        </>
    )
}