'use client'

import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'

export default function UserLogin() {
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(localStorage.getItem("token") || "")
  }, [])


  const loginPath = token === "" ? "/user" : "/user/profile"

  return (
    <div className="max-sm:hidden">
      <Link href={loginPath}>
        <div id="user" className="fixed top-4 right-4 size-44 bg-[url('/img/user.png')] bg-no-repeat bg-contain hover:scale-125 transition-all duration-300 ease-in-out">
        </div>
      </Link>
    </div>
  )
}