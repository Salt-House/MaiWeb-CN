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
            <AnimatedComponent>
                <div className="w-[800px] flex justify-center items-center">

                    <Link href={'/tool/best'}>B50</Link>
                </div>
            </AnimatedComponent>
        </>
    )
}