"use client";

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
            <div className="">

            </div>
        </>
    )
}