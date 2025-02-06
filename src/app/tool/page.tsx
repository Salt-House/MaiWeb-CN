"use client";

import Link from "next/link";
import { useEffect,useState } from "react";



export default function ToolPage(){
    const [token,setToken] = useState<string | null>()

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
        }
    },[])
    useEffect(()=>{

    },[token])

    return(
        <>
            <div className="w-[800px] flex justify-center items-center">
                <Link href={'/tool/best'}>B50</Link>
            </div>
        </>
    )
}