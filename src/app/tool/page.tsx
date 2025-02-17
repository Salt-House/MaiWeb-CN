"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedComponent from "../components/AnimatedComponent";



export default function ToolPage() {
    const [token, setToken] = useState<string | null>()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])
    useEffect(() => {

    }, [token])

    return (
        <>
            <AnimatedComponent isVisible={true}>
                <div className="w-[800px] h-[600px] mx-auto p-2 space-y-2 flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold text-pink-400 ">欢迎来到Maimai.moe 工具页面</h1>
                    <div className="border-b-4 border-b-red-500 rounded-full active:border-b-0 transition-all duration-300 ">
                        <Link href={'/tool/best'} className="w-44 h-16 bg-green-500 rounded-full border-4 border-white text-center text-xl font-bold flex justify-center items-center">Best50</Link>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    )
}