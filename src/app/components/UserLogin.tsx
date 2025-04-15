'use client'

import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'

export default function UserLogin() {
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(localStorage.getItem("token") || "")
  }, [])

  const handleLogin = () => {
    if (token == "") {
      window.location.href = "/user"
    } else {
      window.location.href = "/user/profile"
    }
  }

  return (
    <div onClick={handleLogin} className="max-sm:hidden">
      <div className="fixed top-4 right-4 size-44 bg-[url('/img/user.png')] bg-no-repeat bg-contain hover:scale-125 transition-all duration-300 ease-in-out">
      </div>
    </div>
  )
}