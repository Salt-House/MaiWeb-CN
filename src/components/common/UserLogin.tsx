"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function UserLogin() {
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(localStorage.getItem("token") || "")
  }, [])

  const loginPath = token === "" ? "/user" : "/user/profile"

  return (
    <div className="max-sm:hidden">
      <Link href={loginPath}>
        <div
          id="user"
          className="fixed top-4 right-4 size-44 hover:scale-125 transition-all duration-300 ease-in-out"
        >
          <Image
            src="/img/user.png"
            alt="用户中心"
            fill
            className="object-contain"
            sizes="176px"
            priority
          />
        </div>
      </Link>
    </div>
  )
}
